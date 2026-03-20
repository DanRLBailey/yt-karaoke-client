import { useEffect, useRef, useCallback } from "react";
import styles from "./CornerConfetti.module.scss";

type Corner = "tl" | "tr" | "bl" | "br";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  w: number;
  h: number;
  r: number;
  spin: number;
  color: string;
  shape: "rect" | "circle";
  alpha: number;
}

interface CornerConfettiProps {
  corner?: Corner;
  /** Trigger a new burst by incrementing this value */
  trigger?: number;
  /** Number of confetti particles per burst */
  particleCount?: number;
  /** Custom color palette */
  colors?: string[];
}

const DEFAULT_COLORS = [
  "#7F77DD",
  "#1D9E75",
  "#D85A30",
  "#D4537E",
  "#378ADD",
  "#EF9F27",
  "#E24B4A",
  "#639922",
  "#534AB7",
  "#0F6E56",
];

const rand = (a: number, b: number) => a + Math.random() * (b - a);

const createParticle = (
  x: number,
  y: number,
  vx: number,
  vy: number,
  colors: string[],
): Particle => ({
  x,
  y,
  vx,
  vy,
  ax: 0,
  ay: rand(0.18, 0.32),
  w: rand(5, 10),
  h: rand(4, 8),
  r: 0,
  spin: rand(-0.15, 0.15),
  color: colors[Math.floor(Math.random() * colors.length)],
  shape: Math.random() < 0.6 ? "rect" : "circle",
  alpha: 1,
});

const buildParticles = (
  corner: Corner,
  W: number,
  H: number,
  count: number,
  colors: string[],
): Particle[] => {
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const spd = rand(3, 9);
    let x: number, y: number, vx: number, vy: number;

    if (corner === "tl") {
      x = 0;
      y = 0;
      const angle = rand(0, Math.PI * 0.45);
      vx = Math.cos(angle) * spd;
      vy = Math.sin(angle) * spd;
    } else if (corner === "tr") {
      x = W;
      y = 0;
      const angle = rand(Math.PI * 0.55, Math.PI);
      vx = Math.cos(angle) * spd;
      vy = Math.sin(angle) * spd;
    } else if (corner === "bl") {
      x = 0;
      y = H;
      const angle = rand(-Math.PI * 0.45, 0);
      vx = Math.cos(angle) * spd * 1.5;
      vy = Math.sin(angle) * spd * 1.5;
    } else {
      x = W;
      y = H;
      const angle = rand(Math.PI, Math.PI * 1.45);
      vx = Math.cos(angle) * spd * 1.5;
      vy = -Math.abs(Math.sin(angle) * spd * 1.5);
    }

    particles.push(createParticle(x, y, vx, vy, colors));
  }

  return particles;
};

const CornerConfetti = ({
  corner,
  trigger = 0,
  particleCount = 80,
  colors = DEFAULT_COLORS,
}: CornerConfettiProps) => {
  if (!corner) return;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  const fire = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    particlesRef.current = buildParticles(corner, W, H, particleCount, colors);

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      let alive = 0;

      for (const p of particlesRef.current) {
        p.vy += p.ay;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.spin;

        if (p.y > H + 20) {
          p.alpha = 0;
        } else if (p.y > H * 0.7) {
          p.alpha = Math.max(0, 1 - (p.y - H * 0.7) / (H * 0.35));
        }

        if (p.alpha <= 0) continue;
        alive++;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (alive > 0) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    draw();
  }, [corner, particleCount, colors]);

  // Fire on mount and whenever `trigger` changes
  useEffect(() => {
    fire();
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [fire, trigger]);

  return <canvas ref={canvasRef} className={styles.cornerConfetti} />;
};

export default CornerConfetti;

/**
 * Usage example — overlay all four cannons on a full-screen container:
 *
 * ```tsx
 * import { useState } from 'react'
 * import CornerConfetti from './CornerConfetti'
 *
 * const App = () => {
 *   const [burst, setBurst] = useState(0)
 *   const cannonStyle: React.CSSProperties = {
 *     position: 'absolute',
 *     width: '50%',
 *     height: '50%',
 *   }
 *
 *   return (
 *     <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
 *       <CornerConfetti corner="tl" trigger={burst} style={{ ...cannonStyle, top: 0, left: 0 }} />
 *       <CornerConfetti corner="tr" trigger={burst} style={{ ...cannonStyle, top: 0, right: 0 }} />
 *       <CornerConfetti corner="bl" trigger={burst} style={{ ...cannonStyle, bottom: 0, left: 0 }} />
 *       <CornerConfetti corner="br" trigger={burst} style={{ ...cannonStyle, bottom: 0, right: 0 }} />
 *
 *       <button onClick={() => setBurst(b => b + 1)}>
 *         Celebrate!
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 */
