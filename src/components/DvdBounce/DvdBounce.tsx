import { useRef, useLayoutEffect, useEffect } from "react";
import styles from "./DvdBounce.module.scss";

interface DvdBounceProps {
  children: React.ReactNode;
}

const BASE_SPEED = 2;

const randomSpeed = () => BASE_SPEED * (0.75 + Math.random() * 0.5);
const randomPos = () => Math.random() * 500;

// Neon colors that pop on dark backgrounds
const COLORS = [
  "#FF3B3B",
  "#FF8C00",
  "#FFD700",
  "#00FF87",
  "#00E5FF",
  "#1E90FF",
  "#8A2BE2",
  "#FF1493",
];

const getRandomColor = (current: string | null) => {
  let next = current;
  while (next === current) {
    next = COLORS[Math.floor(Math.random() * COLORS.length)];
  }
  return next!;
};

const DvdBounce = ({ children }: DvdBounceProps) => {
  const divRef = useRef<HTMLSpanElement | null>(null);
  const frameRef = useRef<number | null>(null);

  const posRef = useRef({ x: randomPos(), y: randomPos() });
  const velRef = useRef({
    x: randomSpeed(),
    y: randomSpeed(),
  });
  const sizeRef = useRef({ width: 0, height: 0 });
  const colorRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    if (!divRef.current) return;

    const measure = () => {
      const rect = divRef.current!.getBoundingClientRect();
      sizeRef.current = {
        width: rect.width,
        height: rect.height,
      };
    };

    measure();
    window.addEventListener("resize", measure);

    const initialColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    colorRef.current = initialColor;
    divRef.current.style.color = initialColor;
    divRef.current.style.textShadow = `0 0 12px ${initialColor}`;

    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const tick = () => {
      const pos = posRef.current;
      const vel = velRef.current;
      const size = sizeRef.current;

      let bounced = false;

      pos.x += vel.x;
      pos.y += vel.y;

      const maxX = window.innerWidth - size.width;
      const maxY = window.innerHeight - size.height;

      if (pos.x >= maxX) {
        pos.x = maxX;
        vel.x = -randomSpeed();
        bounced = true;
      }

      if (pos.x <= 0) {
        pos.x = 0;
        vel.x = randomSpeed();
        bounced = true;
      }

      if (pos.y >= maxY) {
        pos.y = maxY;
        vel.y = -randomSpeed();
        bounced = true;
      }

      if (pos.y <= 0) {
        pos.y = 0;
        vel.y = randomSpeed();
        bounced = true;
      }

      if (bounced && divRef.current) {
        const newColor = getRandomColor(colorRef.current);
        colorRef.current = newColor;
        divRef.current.style.color = newColor;
        divRef.current.style.textShadow = `0 0 12px ${newColor}`;
      }

      if (divRef.current) {
        divRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <span className={styles.dvdBounce} ref={divRef}>
      {children}
    </span>
  );
};

export default DvdBounce;
