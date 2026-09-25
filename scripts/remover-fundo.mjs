/**
 * Remove o fundo branco de fotos de produto e salva PNG transparente, aparado
 * — o mesmo padrão das demais imagens do site.
 *
 * Por que não um simples "branco vira transparente": peças metálicas têm
 * faces e reflexos quase brancos (o topo sextavado de uma porca, a lateral
 * iluminada de um joelho). Um corte por cor na imagem inteira abriria buracos
 * nessas faces. Aqui só vira fundo o branco CONECTADO À BORDA da imagem
 * (preenchimento a partir das bordas); branco cercado pela peça fica.
 *
 * No contorno, a peça se mistura com o branco (anti-aliasing do JPEG). Nessa
 * faixa a transparência é parcial, proporcional ao quanto o pixel se afasta do
 * branco, e a cor é "descontaminada" — desfeita a mistura com o branco — para
 * não sobrar halo claro quando a imagem cair sobre um fundo colorido.
 *
 * Uso:
 *   node scripts/remover-fundo.mjs <imagem...> [--saida <pasta>]
 *
 * Sem --saida, grava ao lado da original. O nome de saída é o da original,
 * em minúsculas, sem acentos e com extensão .png.
 */

import sharp from "sharp";
import { resolve, dirname, basename, extname } from "path";
import { mkdirSync } from "fs";

// Menor canal >= isto (e cor neutra) conta como fundo. Não baixar sem conferir:
// na Porca DIN (PA) o fundo é 255 puro e a face clara do sextavado fica em
// 240–245 — com 242 o preenchimento vazava para dentro da peça.
const LIMIAR_FUNDO = 250;
const NEUTRO = 14;        // diferença máxima entre canais para ainda ser "branco"
const LIMIAR_BORDA = 185; // no contorno, abaixo disto o pixel é peça opaca
const FAIXA = 2;          // largura (px) da faixa de contorno com alfa parcial
const ALFA_MIN = 0.12;    // resíduo de JPEG abaixo disto vira transparente

function slug(nome) {
  return nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/°/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function removerFundo(entrada, pastaSaida) {
  const { data, info } = await sharp(entrada)
    .flatten({ background: "#ffffff" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;

  const ehBranco = (p) => {
    const r = data[p * 3], g = data[p * 3 + 1], b = data[p * 3 + 2];
    const mn = Math.min(r, g, b), mx = Math.max(r, g, b);
    return mn >= LIMIAR_FUNDO && mx - mn <= NEUTRO;
  };

  // 1. fundo = branco alcançável a partir da borda (8-vizinhança)
  const fundo = new Uint8Array(N);
  const fila = new Int32Array(N);
  let ini = 0, fim = 0;
  const semear = (p) => {
    if (!fundo[p] && ehBranco(p)) { fundo[p] = 1; fila[fim++] = p; }
  };
  for (let x = 0; x < W; x++) { semear(x); semear((H - 1) * W + x); }
  for (let y = 0; y < H; y++) { semear(y * W); semear(y * W + W - 1); }
  while (ini < fim) {
    const p = fila[ini++], x = p % W, y = (p - x) / W;
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        semear(ny * W + nx);
      }
  }

  // 2. distância (Chebyshev) até o fundo, só até a largura da faixa
  const perto = new Uint8Array(N); // 0 = longe; k = a k px do fundo
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const p = y * W + x;
      if (fundo[p]) continue;
      let d = 0;
      for (let k = 1; k <= FAIXA && !d; k++)
        for (let dy = -k; dy <= k && !d; dy++)
          for (let dx = -k; dx <= k && !d; dx++) {
            const nx = x + dx, ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
            if (fundo[ny * W + nx]) d = k;
          }
      perto[p] = d;
    }

  // 3. monta RGBA: fundo transparente, contorno com alfa parcial e
  //    cor descontaminada, miolo intacto
  const out = Buffer.alloc(N * 4);
  for (let p = 0; p < N; p++) {
    const r = data[p * 3], g = data[p * 3 + 1], b = data[p * 3 + 2];
    let a = 1;
    if (fundo[p]) a = 0;
    else if (perto[p]) {
      const mn = Math.min(r, g, b);
      a = Math.min(1, Math.max(0, (255 - mn) / (255 - LIMIAR_BORDA)));
      if (a < ALFA_MIN) a = 0;
    }
    const i = p * 4;
    if (a === 0) continue; // já zerado
    if (a < 1) {
      // c = a*F + (1-a)*255  =>  F = (c - (1-a)*255) / a
      const tira = (c) => Math.max(0, Math.min(255, Math.round((c - (1 - a) * 255) / a)));
      out[i] = tira(r); out[i + 1] = tira(g); out[i + 2] = tira(b);
    } else {
      out[i] = r; out[i + 1] = g; out[i + 2] = b;
    }
    out[i + 3] = Math.round(a * 255);
  }

  const nomeSaida = slug(basename(entrada, extname(entrada))) + ".png";
  const destino = resolve(pastaSaida ?? dirname(entrada), nomeSaida);
  const png = await sharp(out, { raw: { width: W, height: H, channels: 4 } })
    .trim({ threshold: 1 })
    .png()
    .toBuffer({ resolveWithObject: true });
  await sharp(png.data).toFile(destino);

  let transp = 0;
  for (let p = 0; p < N; p++) if (fundo[p]) transp++;
  console.log(
    `✅ ${basename(entrada)}\n   → ${nomeSaida}  ${png.info.width}×${png.info.height}` +
      `  (fundo removido: ${((transp / N) * 100).toFixed(0)}% da imagem)`
  );
}

async function main() {
  const args = process.argv.slice(2);
  const iSaida = args.indexOf("--saida");
  const pastaSaida = iSaida !== -1 ? resolve(args[iSaida + 1]) : null;
  const arquivos = args.filter(
    (_, i) => iSaida === -1 || (i !== iSaida && i !== iSaida + 1)
  );
  if (!arquivos.length) {
    console.error("Uso: node scripts/remover-fundo.mjs <imagem...> [--saida <pasta>]");
    process.exit(1);
  }
  if (pastaSaida) mkdirSync(pastaSaida, { recursive: true });
  for (const f of arquivos) await removerFundo(resolve(f), pastaSaida);
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
