import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './PlayButton.module.css';

const TEXT = 'СМОТРЕТЬ ВИДЕО • СМОТРЕТЬ ВИДЕО • ';
const RADIUS = 68;

export default function PlayButton({ onClick }) {
  const ringRef = useRef(null);

  useEffect(() => {
    gsap.to(ringRef.current, {
      rotation: 360,
      duration: 9,
      ease: 'none',
      repeat: -1,
    });
  }, []);

  const chars = TEXT.split('');
  const angleStep = 360 / chars.length;

  return (
    <button className={styles.btn} onClick={onClick} aria-label="Смотреть видео">
      {/* Вращающийся текст */}
      <svg
        ref={ringRef}
        className={styles.ring}
        viewBox="-90 -90 180 180"
        width="180"
        height="180"
      >
        {chars.map((char, i) => {
          const angle = angleStep * i - 90;
          const rad = (angle * Math.PI) / 180;
          const x = RADIUS * Math.cos(rad);
          const y = RADIUS * Math.sin(rad);
          return (
            <text
              key={i}
              x={x}
              y={y}
              transform={`rotate(${angle + 90}, ${x}, ${y})`}
              className={styles.char}
            >
              {char}
            </text>
          );
        })}
      </svg>

      {/* Иконка play */}
      <div className={styles.circle}>
        <svg className={styles.playIcon} viewBox="0 0 24 24" fill="none">
          <polygon points="7,4 21,12 7,20" fill="currentColor" />
        </svg>
      </div>
    </button>
  );
}
