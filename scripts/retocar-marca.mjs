/**
 * Remove a marca impressa nos renders de catálogo das mangueiras alimentícias.
 *
 * As imagens vieram do fabricante com "SUPREFLEX" escrito na capa. O texto corre
 * ao longo do eixo da peça e ocupa boa parte do quadro, então não dá para
 * recortar: é preciso reconstruir a superfície embaixo dele.
 *
 * COMO FUNCIONA
 *
 * A imagem é separada em duas camadas:
 *
 *   baixa frequência = o degradê do cilindro (a forma e a luz)
 *   alta frequência  = as nervuras da capa (a textura)
 *
 * A baixa frequência é reconstruída por difusão a partir da borda do buraco
 * (equação de Laplace). Como na fronteira o valor é exatamente o do original, a
 * emenda não aparece. A alta frequência é copiada de outro ponto da própria
 * peça — cada pixel escolhe de onde, testando deslocamentos e ficando com o que
 * melhor casa com a vizinhança ainda visível. O casamento é feito só na alta
 * frequência, então diferença de iluminação entre origem e destino não
 * atrapalha a escolha.
 *
 * Deslocar ao longo do eixo com um período fixo NÃO funciona, e vale registrar
 * por quê: o texto corre na mesma direção do eixo (a amostra cairia sobre o
 * próprio texto) e a perspectiva muda o espaçamento das nervuras ao longo da
 * peça — mediu-se 55px de um lado e 122px do outro na mesma imagem.
 *
 * MÁSCARA
 *
 * Detecção em dois níveis. A semente forte pega o laranja saturado do logotipo.
 * O nível fraco pega o que orbita o texto sem ser laranja puro — o símbolo (TM),
 * verde-oliva escuro, e as bordas suavizadas — apoiado no fato de que a capa
 * azul escura tem R quase zero. O crescimento é limitado a 30px da semente para
 * não invadir a luva metálica, que é cinza.
 *
 * Uso:
 *   node scripts/retocar-marca.mjs          # processa tudo para alimenticias-limpas/
 *   node scripts/retocar-marca.mjs --mascara  # só gera as máscaras, para conferir
 *
 * Confira SEMPRE a máscara antes de aceitar o resultado. O ajuste de cada
 * imagem está em IMAGENS, abaixo, com o motivo de cada exceção.
 */

import sharp from "sharp";
import { readdirSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENTRADA = resolve(__dirname, "alimenticias-src");
const SAIDA = resolve(__dirname, "alimenticias-limpas");

const SO_MASCARA = process.argv.includes("--mascara");

/**
 * Uma entrada por imagem que tem a marca. As três válvulas e as mangueiras
 * trama simples/dupla não têm e ficam de fora.
 *
 *   roi      limita a DETECÇÃO a um retângulo [x, y, largura, altura].
 *   semFraco desliga o nível fraco da detecção.
 *   hfMax    limita a amplitude da textura copiada.
 */
const IMAGENS = [
  {
    arquivo: "03-mangueira-atoxica-pressao.png",
    // As tramas de cobre desta mangueira caem no mesmo limiar de cor do
    // logotipo, então a detecção precisa ficar restrita à área do texto. E o
    // azul da capa aqui é bem mais claro que nas outras (R entre 20 e 70, não
    // perto de zero), o que faria o nível fraco casar com a capa limpa e
    // inundar a máscara.
    roi: [0, 95, 380, 290],
    semFraco: true,
  },
  {
    arquivo: "04-ponteira-inox-din.png",
    // Sem limite, um brilho especular da região de origem era transplantado
    // inteiro e virava um risco de luz no meio da área lisa.
    hfMax: 16,
  },
  { arquivo: "05-ponteira-inox-rjt.png" },
  { arquivo: "06-ponteira-inox-sms.png" },
  { arquivo: "07-ponteira-inox-bsp.png" },
  { arquivo: "08-engate-inox-tc.png" },
  {
    arquivo: "09-engate-rapido-inox-macho.png",
    // Capa preta: o nível fraco pressupõe capa azul e não acrescenta nada aqui.
    semFraco: true,
  },
];

const ALFA = 0.9;       // peso da textura copiada
const RAIO_BAIXA = 14;  // raio que separa baixa de alta frequência
const RAIO_CASA = 11;   // raio da janela que mede o casamento da textura
const MAG_MIN = 55, MAG_MAX = 330, PASSO = 9;
const ITER = 4000;      // iterações da difusão
const ALCANCE_FRACO = 30;

const ehLaranja = (r, g, b, a) => a >= 128 && r > b + 35 && r > g + 15 && r > 60;
const ehSujeira = (r, g, b, a) => a >= 128 && r > 18 && g - r > 12 && b - r > 10;

/** Média móvel separável (caixa) sobre uma grade w x h. */
function fazCaixa(w, h) {
  const tmp = new Float32Array(w * h);
  return (src, dst, r) => {
    for (let y = 0; y < h; y++) {
      let acc = 0;
      for (let x = -r; x <= r; x++) if (x >= 0 && x < w) acc += src[y * w + x];
      for (let x = 0; x < w; x++) {
        tmp[y * w + x] = acc;
        const sai = x - r, entra = x + r + 1;
        if (sai >= 0) acc -= src[y * w + sai];
        if (entra < w) acc += src[y * w + entra];
      }
    }
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let y = -r; y <= r; y++) if (y >= 0 && y < h) acc += tmp[y * w + x];
      for (let y = 0; y < h; y++) {
        dst[y * w + x] = acc;
        const sai = y - r, entra = y + r + 1;
        if (sai >= 0) acc -= tmp[sai * w + x];
        if (entra < h) acc += tmp[entra * w + x];
      }
    }
  };
}

async function retocar(cfg) {
  const { arquivo, roi = null, semFraco = false, hfMax = Infinity } = cfg;
  const t0 = Date.now();
  const { data, info } = await sharp(resolve(ENTRADA, arquivo))
    .raw()
    .toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, C = info.channels, N = W * H;
  const dilata = semFraco ? 8 : 5;

  // ---------- 1. máscara ----------
  const bruta = new Uint8Array(N), fraco = new Uint8Array(N);
  const ROI = roi ? { x0: roi[0], y0: roi[1], x1: roi[0] + roi[2] - 1, y1: roi[1] + roi[3] - 1 } : null;
  for (let p = 0; p < N; p++) {
    if (ROI) {
      const x = p % W, y = (p - x) / W;
      if (x < ROI.x0 || x > ROI.x1 || y < ROI.y0 || y > ROI.y1) continue;
    }
    const i = p * C;
    const r = data[i], g = data[i + 1], b = data[i + 2], a = C === 4 ? data[i + 3] : 255;
    if (ehLaranja(r, g, b, a)) bruta[p] = 1;
    else if (!semFraco && ehSujeira(r, g, b, a)) fraco[p] = 1;
  }
  if (!semFraco) {
    let fila = [];
    const dist = new Int16Array(N).fill(-1);
    for (let p = 0; p < N; p++) if (bruta[p]) { dist[p] = 0; fila.push(p); }
    while (fila.length) {
      const prox = [];
      for (const p of fila) {
        if (dist[p] >= ALCANCE_FRACO) continue;
        const x = p % W, y = (p - x) / W;
        for (let vy = -1; vy <= 1; vy++)
          for (let vx = -1; vx <= 1; vx++) {
            const nx = x + vx, ny = y + vy;
            if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
            const q = ny * W + nx;
            if (dist[q] !== -1 || !fraco[q]) continue;
            dist[q] = dist[p] + 1; bruta[q] = 1; prox.push(q);
          }
      }
      fila = prox;
    }
  }

  const masc = new Uint8Array(N);
  {
    const tmp = new Uint8Array(N);
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        let v = 0;
        for (let k = -dilata; k <= dilata && !v; k++) {
          const xx = x + k;
          if (xx >= 0 && xx < W && bruta[y * W + xx]) v = 1;
        }
        tmp[y * W + x] = v;
      }
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        let v = 0;
        for (let k = -dilata; k <= dilata && !v; k++) {
          const yy = y + k;
          if (yy >= 0 && yy < H && tmp[yy * W + x]) v = 1;
        }
        masc[y * W + x] = v;
      }
  }
  const opaco = new Uint8Array(N), valido = new Uint8Array(N);
  for (let p = 0; p < N; p++) {
    opaco[p] = C === 4 ? (data[p * C + 3] >= 128 ? 1 : 0) : 1;
    valido[p] = opaco[p] && !masc[p] ? 1 : 0;
  }

  let nm = 0, minx = W, miny = H, maxx = -1, maxy = -1;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (masc[y * W + x]) {
        nm++;
        if (x < minx) minx = x; if (x > maxx) maxx = x;
        if (y < miny) miny = y; if (y > maxy) maxy = y;
      }
  if (nm === 0) {
    console.log(`  ${arquivo}: nenhuma marca encontrada, pulando (já está limpa?)`);
    return;
  }
  console.log(`  máscara: ${nm} px  bbox ${minx},${miny} -> ${maxx},${maxy}`);

  if (SO_MASCARA) {
    const vis = Buffer.from(data);
    for (let p = 0; p < N; p++)
      if (masc[p]) { vis[p * C] = 255; vis[p * C + 1] = 0; vis[p * C + 2] = 255; }
    await sharp(vis, { raw: { width: W, height: H, channels: C } })
      .png()
      .toFile(resolve(SAIDA, arquivo.replace(".png", "-MASCARA.png")));
    console.log("  máscara gravada para conferência");
    return;
  }

  const M = RAIO_CASA + 4;
  const rx0 = Math.max(0, minx - M), ry0 = Math.max(0, miny - M);
  const rx1 = Math.min(W - 1, maxx + M), ry1 = Math.min(H - 1, maxy + M);
  const RW = rx1 - rx0 + 1, RH = ry1 - ry0 + 1;
  const rIdx = (x, y) => (y - ry0) * RW + (x - rx0);
  const caixa = fazCaixa(RW, RH), caixaTudo = fazCaixa(W, H);

  // ---------- 2. alta frequência (imagem inteira, para a busca varrer tudo) ----------
  const alta = [new Float32Array(N), new Float32Array(N), new Float32Array(N)];
  {
    const s = new Float32Array(N), n = new Float32Array(N);
    const sB = new Float32Array(N), nB = new Float32Array(N);
    for (let p = 0; p < N; p++) n[p] = valido[p];
    caixaTudo(n, nB, RAIO_BAIXA);
    for (let c = 0; c < 3; c++) {
      s.fill(0);
      for (let p = 0; p < N; p++) if (valido[p]) s[p] = data[p * C + c];
      caixaTudo(s, sB, RAIO_BAIXA);
      for (let p = 0; p < N; p++)
        alta[c][p] = valido[p] && nB[p] >= 30 ? data[p * C + c] - sB[p] / nB[p] : NaN;
    }
  }

  // ---------- 3. escolha do deslocamento ----------
  const cands = [];
  for (let dx = -MAG_MAX; dx <= MAG_MAX; dx += PASSO)
    for (let dy = -MAG_MAX; dy <= MAG_MAX; dy += PASSO) {
      const m = Math.hypot(dx, dy);
      if (m >= MAG_MIN && m <= MAG_MAX) cands.push([dx, dy]);
    }

  const melhorCusto = new Float32Array(N).fill(Infinity);
  const melhorDx = new Int16Array(N), melhorDy = new Int16Array(N);
  const temFonte = new Uint8Array(N);
  const err = new Float32Array(RW * RH), peso = new Float32Array(RW * RH);
  const errB = new Float32Array(RW * RH), pesoB = new Float32Array(RW * RH);

  for (const [dx, dy] of cands) {
    err.fill(0); peso.fill(0);
    for (let y = ry0; y <= ry1; y++)
      for (let x = rx0; x <= rx1; x++) {
        const xs = x + dx, ys = y + dy;
        if (xs < 0 || ys < 0 || xs >= W || ys >= H) continue;
        const p = y * W + x, q = ys * W + xs;
        if (!valido[p] || !valido[q]) continue;
        const a0 = alta[0][p], b0 = alta[0][q];
        if (Number.isNaN(a0) || Number.isNaN(b0)) continue;
        const k = rIdx(x, y);
        err[k] = Math.abs(a0 - b0) + Math.abs(alta[1][p] - alta[1][q]) +
                 Math.abs(alta[2][p] - alta[2][q]);
        peso[k] = 1;
      }
    caixa(err, errB, RAIO_CASA);
    caixa(peso, pesoB, RAIO_CASA);
    for (let y = ry0; y <= ry1; y++)
      for (let x = rx0; x <= rx1; x++) {
        const p = y * W + x;
        if (!masc[p]) continue;
        const xs = x + dx, ys = y + dy;
        if (xs < 0 || ys < 0 || xs >= W || ys >= H) continue;
        const q = ys * W + xs;
        if (!valido[q] || Number.isNaN(alta[0][q])) continue;
        const k = rIdx(x, y);
        if (pesoB[k] < 50) continue;
        const custo = errB[k] / pesoB[k];
        if (custo < melhorCusto[p]) {
          melhorCusto[p] = custo; melhorDx[p] = dx; melhorDy[p] = dy; temFonte[p] = 1;
        }
      }
  }

  // No miolo dos traços das letras a janela de casamento cai inteira dentro do
  // buraco e não sobra vizinhança para comparar. Esses pixels herdam o
  // deslocamento de quem está mais perto da borda.
  {
    let fila = [];
    for (let p = 0; p < N; p++) if (masc[p] && temFonte[p]) fila.push(p);
    while (fila.length) {
      const prox = [];
      for (const p of fila) {
        const x = p % W, y = (p - x) / W;
        const dx = melhorDx[p], dy = melhorDy[p];
        for (const [vx, vy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + vx, ny = y + vy;
          if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
          const q = ny * W + nx;
          if (!masc[q] || temFonte[q]) continue;
          const sx = nx + dx, sy = ny + dy;
          if (sx < 0 || sy < 0 || sx >= W || sy >= H) continue;
          const s = sy * W + sx;
          if (!valido[s] || Number.isNaN(alta[0][s])) continue;
          melhorDx[q] = dx; melhorDy[q] = dy; temFonte[q] = 1; prox.push(q);
        }
      }
      fila = prox;
    }
  }

  // ---------- 4. difusão + textura ----------
  const canal = new Float32Array(N);
  const out = Buffer.from(data);
  for (let c = 0; c < 3; c++) {
    let soma = 0, cnt = 0;
    for (let y = ry0; y <= ry1; y++)
      for (let x = rx0; x <= rx1; x++) {
        const p = y * W + x;
        canal[p] = data[p * C + c];
        if (valido[p]) { soma += canal[p]; cnt++; }
      }
    const media = soma / cnt;
    for (let y = ry0; y <= ry1; y++)
      for (let x = rx0; x <= rx1; x++) {
        const p = y * W + x;
        if (masc[p]) canal[p] = media;
      }
    for (let it = 0; it < ITER; it++) {
      const frente = it % 2 === 0;
      for (let yi = 0; yi < RH; yi++) {
        const y = frente ? ry0 + yi : ry1 - yi;
        for (let xi = 0; xi < RW; xi++) {
          const x = frente ? rx0 + xi : rx1 - xi;
          const p = y * W + x;
          if (!masc[p]) continue;
          let a = 0, n = 0;
          if (x > 0 && opaco[p - 1]) { a += canal[p - 1]; n++; }
          if (x < W - 1 && opaco[p + 1]) { a += canal[p + 1]; n++; }
          if (y > 0 && opaco[p - W]) { a += canal[p - W]; n++; }
          if (y < H - 1 && opaco[p + W]) { a += canal[p + W]; n++; }
          if (n) canal[p] = a / n;
        }
      }
    }
    for (let y = ry0; y <= ry1; y++)
      for (let x = rx0; x <= rx1; x++) {
        const p = y * W + x;
        if (!masc[p]) continue;
        let v = canal[p];
        if (temFonte[p]) {
          let hf = alta[c][(y + melhorDy[p]) * W + (x + melhorDx[p])];
          if (!Number.isNaN(hf)) {
            if (hf > hfMax) hf = hfMax;
            if (hf < -hfMax) hf = -hfMax;
            v += ALFA * hf;
          }
        }
        out[p * C + c] = Math.max(0, Math.min(255, Math.round(v)));
      }
  }

  await sharp(out, { raw: { width: W, height: H, channels: C } })
    .png()
    .toFile(resolve(SAIDA, arquivo));
  console.log(`  ✅ ${arquivo}  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}

async function main() {
  mkdirSync(SAIDA, { recursive: true });
  const existentes = new Set(readdirSync(ENTRADA));
  console.log(SO_MASCARA ? "🔍 Só as máscaras\n" : `🎨 Retocando ${IMAGENS.length} imagens\n`);
  for (const cfg of IMAGENS) {
    if (!existentes.has(cfg.arquivo)) {
      console.error(`❌ não encontrado: ${cfg.arquivo}`);
      continue;
    }
    console.log(cfg.arquivo);
    await retocar(cfg);
  }
  console.log(`\nSaída em scripts/alimenticias-limpas/`);
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
