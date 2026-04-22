import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './WeddingsIntro.module.css';

export default function WeddingsIntro({ onComplete }) {
  const wrapRef = useRef(null);
  const logoRef = useRef(null);
  const nameRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(logoRef.current,
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' }
    )
    .fromTo(nameRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo(subtitleRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.2'
    )
    .to(wrapRef.current, {
      opacity: 0,
      duration: 0.7,
      ease: 'power2.inOut',
      delay: 0.8,
      onComplete,
    });
  }, []);

  return (
    <div ref={wrapRef} className={styles.intro}>
      <div ref={logoRef} className={styles.logoWrap}>
        <img
          src="/logo.png"
          alt="Логотип"
          className={styles.logoImg}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <span className={styles.logoFallback} style={{ display: 'none' }}>
          A<span className={styles.logoD}>D</span>
        </span>
      </div>
      <p ref={nameRef} className={styles.name}>АЛЕКСАНДР ДИН</p>
      <p ref={subtitleRef} className={styles.subtitle}>Ведущий мероприятий</p>
    </div>
  );
}
