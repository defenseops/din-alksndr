import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './Loader.module.css';

export default function Loader({ onComplete }) {
  const counterRef = useRef(null);
  const percentRef = useRef(null);
  const lineRef = useRef(null);
  const loaderRef = useRef(null);
  const logoRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline();

    // Logo fade in
    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
    );

    // Counter animation: number rises from bottom to top as it counts up
    const totalTravel = window.innerHeight * 0.82;
    gsap.set(percentRef.current, { y: totalTravel });

    const obj = { val: 0 };
    tl.to(
      obj,
      {
        val: 100,
        duration: 2.4,
        ease: 'power2.inOut',
        onUpdate() {
          const v = Math.round(obj.val);
          setCount(v);
          const progress = v / 100;
          gsap.set(percentRef.current, {
            y: totalTravel * (1 - progress),
          });
        },
      },
      '-=0.2'
    );

    // Line grows
    tl.fromTo(
      lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.2, ease: 'power2.inOut', transformOrigin: 'left center' },
      '<'
    );

    // Fade out loader
    tl.to(loaderRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete,
    });
  }, []);

  const hasLogo = true; // переключить на false если лого не загружается

  return (
    <div ref={loaderRef} className={styles.loader}>
      <div ref={logoRef} className={styles.logo}>
        {hasLogo ? (
          <img src="/logo.png" alt="Александр Дин" className={styles.logoImg}
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline'; }}
          />
        ) : null}
        <span className={styles.logoText} style={{ display: hasLogo ? 'none' : 'inline' }}>
          A<span className={styles.logoTextD}>D</span>
        </span>
      </div>
      <div ref={percentRef} className={styles.counterWrap}>
        <span className={styles.counter}>{count}</span>
        <span className={styles.symbol}>%</span>
      </div>
      <div ref={lineRef} className={styles.line} />
    </div>
  );
}
