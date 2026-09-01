/**
 * Compõe, numa única imagem, a foto do produto e as "bolinhas" de cores
 * disponíveis — usado pelos tubos da Linha Pneumática.
 *
 * No Figma as bolinhas são um elemento separado, entre a foto e a descrição.
 * Embutindo-as na própria imagem, a linha do produto continua sendo
 * nome + imagem + descrição e o layout padrão do site serve sem alteração
 * nenhuma de schema ou de CSS.
 *
 * Também desenha a moldura amarela que a foto tem no Figma. Para gerar sem a
 * moldura, rode com --sem-borda.
 *
 * Lê de  scripts/linha-pneumatica-src/{arquivo}.png
 *      + scripts/linha-pneumatica-src/bolinhas/{svg}
 * Escreve scripts/linha-pneumatica-src/merged/{arquivo}.png
 *
 * Uso:
 *   node scripts/merge-bolinhas.mjs
 *   node scripts/merge-bolinhas.mjs --sem-borda
 */

import sharp from "sharp";
import { readFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, "linha-pneumatica-src");
const OUT = resolve(SRC, "merged");
const COM_BORDA = !process.argv.includes("--sem-borda");

const FOTO = 120; // lado da foto no Figma
const GAP = 12; // respiro entre foto e bolinhas
const AMARELO = { r: 248, g: 187, b: 0, alpha: 1 };

// arquivo da foto → svg das bolinhas (relativo a bolinhas/)
const PARES = [
  ["01-mangueiras-espirais-em-pu.png", "b60bbe99-6062-4001-b035-2000b3247fd7.svg"],
  ["01-tubos-pu.png", "66c8399b-8f96-4d04-80b9-93603d4b9fa6.svg"],
  ["01-tubos-pa6.png", "e166df54-e9b7-49ed-b28c-a5da41ac341a.svg"],
  ["01-tubos-pa12.png", "e166df54-e9b7-49ed-b28c-a5da41ac341a.svg"],
  ["01-tubos-pebd.png", "3b1c9221-61ce-449e-ac2b-0449839266df.svg"],
  ["01-tubos-pfa-teflon.png", "3b1c9221-61ce-449e-ac2b-0449839266df.svg"],
  ["01-tubo-suctor-odontologico.png", "1059838d-9d58-483e-b51e-d0617915a74a.svg"],
  ["01-tubo-dupla-pedal-odontologico.png", "3b1c9221-61ce-449e-ac2b-0449839266df.svg"],
  ["01-tubo-tripla-seringa-odontologico.png", "3b1c9221-61ce-449e-ac2b-0449839266df.svg"],
];

function dimensoesSvg(buf) {
  const t = buf.toString("utf8");
  return {
    w: +(t.match(/width="(\d+)"/) || [])[1],
    h: +(t.match(/height="(\d+)"/) || [])[1],
  };
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  console.log(`🎨 Compondo ${PARES.length} imagens${COM_BORDA ? " (com moldura amarela)" : ""}\n`);

  for (const [arquivo, svg] of PARES) {
    const caminhoFoto = resolve(SRC, arquivo);
    const caminhoSvg = resolve(SRC, "bolinhas", svg);
    if (!existsSync(caminhoFoto)) throw new Error(`foto não encontrada: ${arquivo}`);
    if (!existsSync(caminhoSvg)) throw new Error(`svg não encontrado: ${svg}`);

    const svgBuf = readFileSync(caminhoSvg);
    const { w: sw, h: sh } = dimensoesSvg(svgBuf);

    // A foto entra num quadrado de 120px, contida e centralizada — as fotos
    // vêm com proporções variadas e não podem ser esticadas.
    const foto = await sharp(caminhoFoto)
      .resize(FOTO, FOTO, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    const bolinhas = await sharp(svgBuf, { density: 288 }) // 4x para não seiar
      .resize(sw * 2, sh * 2, { fit: "fill" })
      .png()
      .toBuffer();

    const bw = sw * 2;
    const bh = sh * 2;
    const escala = 2; // trabalhamos em 2x e a foto acompanha
    const fotoEsc = await sharp(foto).resize(FOTO * escala, FOTO * escala).png().toBuffer();

    const larguraTotal = FOTO * escala + GAP * escala + bw;
    const alturaTotal = FOTO * escala;

    const camadas = [
      { input: fotoEsc, left: 0, top: 0 },
      // bolinhas centralizadas verticalmente em relação à foto
      { input: bolinhas, left: (FOTO + GAP) * escala, top: Math.round((alturaTotal - bh) / 2) },
    ];

    if (COM_BORDA) {
      const b = Buffer.from(
        `<svg width="${FOTO * escala}" height="${FOTO * escala}"><rect x="1" y="1" width="${
          FOTO * escala - 2
        }" height="${FOTO * escala - 2}" fill="none" stroke="rgb(${AMARELO.r},${AMARELO.g},${
          AMARELO.b
        })" stroke-width="2"/></svg>`
      );
      camadas.push({ input: b, left: 0, top: 0 });
    }

    await sharp({
      create: {
        width: larguraTotal,
        height: alturaTotal,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite(camadas)
      .png()
      .toFile(resolve(OUT, arquivo));

    console.log(
      `  ✅ ${arquivo.padEnd(38)} ${larguraTotal}x${alturaTotal}  (bolinhas ${sw}x${sh})`
    );
  }

  console.log(`\n📁 saída: scripts/linha-pneumatica-src/merged/`);
}

main().catch((e) => {
  console.error("Erro:", e.message);
  process.exit(1);
});
