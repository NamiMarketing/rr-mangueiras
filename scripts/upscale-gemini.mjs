/**
 * Upscale/realce das imagens via Gemini 2.5 Flash Image ("Nano Banana").
 *
 * Entrada:  scripts/abracadeiras-src/*.png  (exports limpos, fundo branco)
 * Saída:    scripts/abracadeiras-figma/*.png
 *
 * ⚠️ Modelo GENERATIVO: pode alterar levemente os detalhes do produto.
 *
 * Requer no .env: GEMINI_API_KEY  (opcional: GEMINI_IMAGE_MODEL)
 * Uso: node scripts/upscale-gemini.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { config } from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, "..", ".env") });

const KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
if (!KEY) {
  console.error("❌ GEMINI_API_KEY não encontrado no .env");
  process.exit(1);
}

const SRC = resolve(__dirname, "abracadeiras-src");
const OUT = resolve(__dirname, "abracadeiras-figma");

const PROMPT =
  "Upscale this product photo to a higher resolution. Keep the product EXACTLY identical " +
  "in shape, proportions, materials, textures and markings — do not redraw, redesign or add " +
  "anything. Only increase sharpness, detail and resolution. Keep a clean pure white background. " +
  "Centered product, studio lighting, photorealistic.";

async function upscaleOne(file) {
  const buffer = readFileSync(resolve(SRC, file));
  const body = {
    contents: [
      {
        parts: [
          { text: PROMPT },
          { inline_data: { mime_type: "image/png", data: buffer.toString("base64") } },
        ],
      },
    ],
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Gemini erro: ${JSON.stringify(json).slice(0, 300)}`);
  }

  const parts = json?.candidates?.[0]?.content?.parts ?? [];
  const imgPart = parts.find((p) => p.inline_data || p.inlineData);
  if (!imgPart) {
    throw new Error(`Sem imagem na resposta: ${JSON.stringify(json).slice(0, 300)}`);
  }
  const data = (imgPart.inline_data || imgPart.inlineData).data;
  const outBuf = Buffer.from(data, "base64");
  writeFileSync(resolve(OUT, file), outBuf);
  return outBuf.length;
}

async function main() {
  const files = readdirSync(SRC).filter((f) => f.endsWith(".png")).sort();
  console.log(`🍌 Gemini (${MODEL}) — ${files.length} imagens...\n`);
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    process.stdout.write(`[${i + 1}/${files.length}] ${f} ... `);
    try {
      const bytes = await upscaleOne(f);
      console.log(`✅ ${(bytes / 1024).toFixed(0)} KB`);
    } catch (e) {
      console.log(`❌ ${e.message}`);
    }
  }
  console.log("\n✅ Concluído. Próximo: remover branco + re-seed.");
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
