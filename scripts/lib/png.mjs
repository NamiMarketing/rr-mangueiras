/**
 * Decodifica, gira e re-codifica PNG de 8 bits (RGB ou RGBA) usando só o zlib
 * do Node — o projeto não tem sharp nem jimp, e não valia adicionar dependência
 * para girar duas fotos.
 *
 * Suporta apenas bitDepth 8 e colorType 2 (RGB) ou 6 (RGBA), que é o que as
 * imagens de produto usam. Qualquer outra coisa lança erro em vez de gravar
 * lixo silenciosamente.
 */
import { inflateSync, deflateSync, crc32 } from "zlib";

export function decodePNG(buf) {
  let off = 8, w, h, bitDepth, colorType, idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const tipo = buf.toString("ascii", off + 4, off + 8);
    const d = buf.subarray(off + 8, off + 8 + len);
    if (tipo === "IHDR") { w = d.readUInt32BE(0); h = d.readUInt32BE(4); bitDepth = d[8]; colorType = d[9]; }
    else if (tipo === "IDAT") idat.push(d);
    else if (tipo === "IEND") break;
    off += 12 + len;
  }
  if (bitDepth !== 8 || ![2, 6].includes(colorType))
    throw new Error(`PNG não suportado: bitDepth=${bitDepth} colorType=${colorType}`);
  const canais = colorType === 6 ? 4 : 3;
  const raw = inflateSync(Buffer.concat(idat));
  const stride = w * canais;
  const px = Buffer.alloc(h * stride);
  let p = 0;
  for (let y = 0; y < h; y++) {
    const f = raw[p++], linha = raw.subarray(p, p + stride); p += stride;
    const dest = px.subarray(y * stride, (y + 1) * stride);
    const ant = y > 0 ? px.subarray((y - 1) * stride, y * stride) : Buffer.alloc(stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= canais ? dest[x - canais] : 0, b = ant[x], c = x >= canais ? ant[x - canais] : 0, v = linha[x];
      let r;
      if (f === 0) r = v; else if (f === 1) r = v + a; else if (f === 2) r = v + b;
      else if (f === 3) r = v + ((a + b) >> 1);
      else if (f === 4) { const pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c);
        r = v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c); }
      else throw new Error("filtro " + f);
      dest[x] = r & 0xff;
    }
  }
  return { w, h, canais, px };
}

function chunk(tipo, dados) {
  const len = Buffer.alloc(4); len.writeUInt32BE(dados.length);
  const corpo = Buffer.concat([Buffer.from(tipo, "ascii"), dados]);
  const c = Buffer.alloc(4); c.writeUInt32BE(crc32(corpo) >>> 0);
  return Buffer.concat([len, corpo, c]);
}

export function encodePNG({ w, h, canais, px }) {
  const stride = w * canais;
  const raw = Buffer.alloc(h * (stride + 1));
  for (let y = 0; y < h; y++) {
    raw[y * (stride + 1)] = 0;                       // filtro 0 (None)
    px.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = canais === 4 ? 6 : 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/** Gira 180°: o pixel (x,y) vai para (w-1-x, h-1-y). */
export function girar180({ w, h, canais, px }) {
  const out = Buffer.alloc(px.length);
  const total = w * h;
  for (let i = 0; i < total; i++) {
    const origem = i * canais, destino = (total - 1 - i) * canais;
    px.copy(out, destino, origem, origem + canais);
  }
  return { w, h, canais, px: out };
}
