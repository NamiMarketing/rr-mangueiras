import Image, { type StaticImageData } from "next/image";
import styles from "./ParanaMap.module.css";
import { PARANA_PATH, PARANA_VIEWBOX } from "./parana-path";
import curitiba from "@/img/contato/curitiba.png";
import colombo from "@/img/contato/colombo.png";
import pontaGrossa from "@/img/contato/ponta-grossa.png";

const VB_W = 1000;
const VB_H = 701;
const THUMB_W = 290;
const THUMB_H = 209;

interface Unidade {
  cidade: string;
  image: StaticImageData;
  /** Posição do pino no mapa (unidades do viewBox) */
  pin: { x: number; y: number };
  /** Canto superior esquerdo da miniatura (unidades do viewBox) */
  thumb: { x: number; y: number };
}

const unidades: Unidade[] = [
  {
    cidade: "Colombo",
    image: colombo,
    pin: { x: 817.87, y: 462.9 },
    thumb: { x: 330, y: 30 },
  },
  {
    cidade: "Ponta Grossa",
    image: pontaGrossa,
    pin: { x: 675.7, y: 429.53 },
    thumb: { x: 28, y: 270 },
  },
  {
    cidade: "Curitiba",
    image: curitiba,
    pin: { x: 810.44, y: 485.7 },
    thumb: { x: 352, y: 458 },
  },
];

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

export default function ParanaMap() {
  return (
    <div className={styles.wrap}>
      <svg
        className={styles.map}
        viewBox={PARANA_VIEWBOX}
        role="img"
        aria-label="Mapa do Paraná com as unidades de Curitiba, Colombo e Ponta Grossa"
      >
        <defs>
          <linearGradient id="prFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2b3c5c" />
            <stop offset="100%" stopColor="#1a2640" />
          </linearGradient>
          <filter id="prGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* contorno do estado */}
        <path
          d={PARANA_PATH}
          fill="url(#prFill)"
          stroke="rgba(248, 187, 0, 0.55)"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />

        {unidades.map((u) => {
          const ax = u.thumb.x + THUMB_W;
          const ay = u.thumb.y + THUMB_H / 2;
          return (
            <g key={u.cidade}>
              {/* linha ligando a miniatura ao pino */}
              <line
                x1={ax}
                y1={ay}
                x2={u.pin.x}
                y2={u.pin.y}
                stroke="rgba(248, 187, 0, 0.5)"
                strokeWidth={1.6}
                strokeDasharray="5 6"
              />
              <circle cx={ax} cy={ay} r={4} fill="#f8bb00" />

              {/* anéis pulsantes */}
              <circle className={styles.pulse} cx={u.pin.x} cy={u.pin.y} r={10} />
              <circle
                className={`${styles.pulse} ${styles.pulseDelay}`}
                cx={u.pin.x}
                cy={u.pin.y}
                r={10}
              />

              {/* pino */}
              <circle cx={u.pin.x} cy={u.pin.y} r={9} fill="#f8bb00" filter="url(#prGlow)" />
              <circle cx={u.pin.x} cy={u.pin.y} r={4} fill="#10111f" />
            </g>
          );
        })}
      </svg>

      {/* miniaturas das lojas sobrepostas ao mapa */}
      {unidades.map((u) => (
        <figure
          key={u.cidade}
          className={styles.thumb}
          style={{
            left: pct(u.thumb.x, VB_W),
            top: pct(u.thumb.y, VB_H),
            width: pct(THUMB_W, VB_W),
          }}
        >
          <Image
            src={u.image}
            alt={`Unidade ${u.cidade}`}
            className={styles.thumbImg}
            sizes="(max-width: 900px) 30vw, 15vw"
          />
          <figcaption className={styles.thumbLabel}>{u.cidade}</figcaption>
        </figure>
      ))}
    </div>
  );
}
