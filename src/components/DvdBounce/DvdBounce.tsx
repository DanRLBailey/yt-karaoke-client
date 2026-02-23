import { useRef, useLayoutEffect, useEffect } from "react";
import styles from "./DvdBounce.module.scss";

interface DvdBounceProps {
  children: React.ReactNode;
  onBounce?: (color: string) => void;
}

const BASE_SPEED = 2;
const CORNER_RADIUS = 150;
const CORNER_TOLERANCE = 5;

const randomSpeed = () => BASE_SPEED * (0.75 + Math.random() * 0.5);
const randomPos = () => Math.random() * 500;

// Neon colors that pop on dark backgrounds
const colors = [
  "#FF3B3B",
  "#FF8C00",
  "#FFD700",
  "#00FF87",
  "#2ACCC9",
  "#00E5FF",
  "#1E90FF",
  "#8A2BE2",
  "#FF1493",
];

const getRandomColor = (current: string | null) => {
  let next = current;
  while (next === current) {
    next = colors[Math.floor(Math.random() * colors.length)];
  }
  return next!;
};

const randomSign = (): 1 | -1 => (Math.random() < 0.5 ? -1 : 1);

const DvdBounce = ({ children }: DvdBounceProps) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);

  const posRef = useRef({ x: randomPos(), y: randomPos() });
  const velRef = useRef({
    x: randomSpeed() * randomSign(),
    y: randomSpeed() * randomSign(),
  });
  const sizeRef = useRef({ width: 0, height: 0 });
  const colorRef = useRef<string | null>(null);
  const initialColor = colors[Math.floor(Math.random() * colors.length)];

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

    const shadow = `0 0 12px ${initialColor}`;

    colorRef.current = initialColor;
    divRef.current.style.color = initialColor;
    divRef.current.style.textShadow = shadow;

    const child = divRef.current.children[0];
    if (child instanceof HTMLDivElement) {
      child.style.boxShadow = shadow;
    }

    return () => window.removeEventListener("resize", measure);
  }, [children]);

  useEffect(() => {
    const tick = () => {
      const pos = posRef.current;
      const vel = velRef.current;
      const size = sizeRef.current;

      const maxX = window.innerWidth - size.width;
      const maxY = window.innerHeight - size.height;

      // Predict next frame
      const nextX = pos.x + vel.x;
      const nextY = pos.y + vel.y;

      // Determine which corner we're heading toward
      const targetCornerX = vel.x > 0 ? maxX : 0;
      const targetCornerY = vel.y > 0 ? maxY : 0;

      // Distance from next position to that true corner
      const dx = targetCornerX - nextX;
      const dy = targetCornerY - nextY;
      const distanceToCorner = Math.sqrt(dx * dx + dy * dy);

      const withinCornerRadius = distanceToCorner <= CORNER_RADIUS;

      if (withinCornerRadius) {
        console.log("🔥 Within corner radius:", Math.round(distanceToCorner));
      }

      // Apply movement
      pos.x = nextX;
      pos.y = nextY;

      let hitX = false;
      let hitY = false;

      if (pos.x >= maxX) {
        pos.x = maxX;
        vel.x = -randomSpeed();
        hitX = true;
      }

      if (pos.x <= 0) {
        pos.x = 0;
        vel.x = randomSpeed();
        hitX = true;
      }

      if (pos.y >= maxY) {
        pos.y = maxY;
        vel.y = -randomSpeed();
        hitY = true;
      }

      if (pos.y <= 0) {
        pos.y = 0;
        vel.y = randomSpeed();
        hitY = true;
      }

      // --- TRUE CORNER (WITH TOLERANCE) ---
      const nearLeft = pos.x <= CORNER_TOLERANCE;
      const nearRight = Math.abs(pos.x - maxX) <= CORNER_TOLERANCE;
      const nearTop = pos.y <= CORNER_TOLERANCE;
      const nearBottom = Math.abs(pos.y - maxY) <= CORNER_TOLERANCE;

      const hitCorner = (nearLeft || nearRight) && (nearTop || nearBottom);

      if (hitCorner) {
        console.log("💥 CORNER (within 5px)");
      }

      const bounced = hitX || hitY;

      if (bounced && divRef.current) {
        const newColor = getRandomColor(colorRef.current);
        const shadow = `0 0 12px ${newColor}`;

        colorRef.current = newColor;
        divRef.current.style.color = newColor;
        divRef.current.style.textShadow = shadow;

        const child = divRef.current?.children[0] as HTMLElement | undefined;
        if (child instanceof HTMLDivElement) {
          child.style.boxShadow = shadow;
        }
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
    <div className={styles.dvdBounce} ref={divRef}>
      {children}
    </div>
  );
};

export default DvdBounce;
