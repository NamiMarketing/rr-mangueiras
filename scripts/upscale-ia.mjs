/**
 * Upscale das imagens via IA (Real-ESRGAN no Replicate).
 *
 * Entrada:  scripts/abracadeiras-src/*.png  (exports limpos, fundo branco)
 * Saída:    scripts/abracadeiras-figma/*.png (upscaled 4x, ainda com fundo branco)
 *
 * Depois rode a remoção de branco + seed.
 *
 * Requer no .env: REPLICATE_API_TOKEN
 * Uso: node scripts/upscale-ia.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { config } from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, "..", ".env") });

const TOKEN = process.env.REPLICATE_API_TOKEN;
if (!TOKEN) {
  console.error("❌ REPLICATE_API_TOKEN não encontrado no .env");
  process.exit(1);
}

const SRC = resolve(__dirname, "abracadeiras-src");
const OUT = resolve(__dirname, "abracadeiras-figma");
const MODEL = "nightmareai/real-esrgan";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function createPrediction(dataUri) {
  for (let attempt = 0; attempt < 8; attempt++) {
    const res = await fetch(
      `https://api.replicate.com/v1/models/${MODEL}/predictions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
          Prefer: "wait",
        },
        body: JSON.stringify({
          input: { image: dataUri, scale: 4, face_enhance: false },
        }),
      }
    );
    const json = await res.json();
    if (res.status === 429) {
      const wait = (json.retry_after ?? 10) + 1;
      await sleep(wait * 1000);
      continue;
    }
    if (!res.ok) throw new Error(`Replicate erro: ${JSON.stringify(json)}`);
    return json;
  }
  throw new Error("Rate limit persistente (429) após várias tentativas");
}

async function upscaleOne(file) {
  const buffer = readFileSync(resolve(SRC, file));
  const dataUri = `data:image/png;base64,${buffer.toString("base64")}`;

  let pred = await createPrediction(dataUri);

  // Caso ainda não tenha terminado, faz polling
  while (pred.status !== "succeeded" && pred.status !== "failed" && pred.status !== "canceled") {
    await sleep(2000);
    const getRes = await fetch(pred.urls.get, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    pred = await getRes.json();
  }

  if (pred.status !== "succeeded") {
    throw new Error(`Predição ${pred.status}: ${JSON.stringify(pred.error)}`);
  }

  const outUrl = Array.isArray(pred.output) ? pred.output[0] : pred.output;
  const imgRes = await fetch(outUrl);
  const outBuf = Buffer.from(await imgRes.arrayBuffer());
  writeFileSync(resolve(OUT, file), outBuf);
  return outBuf.length;
}

async function main() {
  const argFiles = process.argv.slice(2).filter((a) => a.endsWith(".png"));
  const files =
    argFiles.length > 0
      ? argFiles
      : readdirSync(SRC).filter((f) => f.endsWith(".png")).sort();
  console.log(`🤖 Upscale IA (Real-ESRGAN) de ${files.length} imagens...\n`);
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
  console.log("\n✅ Concluído. Próximo passo: remover branco + re-seed.");
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
