import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Helmet } from 'react-helmet-async';
import styles from './Home.module.css';

export default function Home() {
  const contentRef = useRef(null);
  const subtitleRef = useRef(null);
  const nameRef = useRef(null);
  const dividerRef = useRef(null);
  const buttonsRef = useRef(null);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/sections`)
      .then((r) => r.json())
      .then(setSections)
      .catch(() =>
        setSections([
          { id: 'weddings', label: 'Свадьбы', href: '#weddings' },
          { id: 'corporate', label: 'Корпоративы', href: '#corporate' },
        ])
      );
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(subtitleRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.8 })
      .fromTo(nameRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 }, '-=0.4')
      .fromTo(dividerRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.8, transformOrigin: 'left center' }, '-=0.5')
      .fromTo(buttonsRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.3');
  }, []);

  return (
    <>
    <Helmet>
      <title>Александр Дин — Ведущий мероприятий в Казахстане</title>
      <meta name="description" content="Александр Дин — профессиональный ведущий свадеб и корпоративных мероприятий в Казахстане. Яркие эмоции, безупречная организация." />
      <link rel="canonical" href="https://din-aleksndr.kz/" />
      <meta property="og:title" content="Александр Дин — Ведущий мероприятий в Казахстане" />
      <meta property="og:description" content="Александр Дин — профессиональный ведущий свадеб и корпоративных мероприятий в Казахстане." />
      <meta property="og:url" content="https://din-aleksndr.kz/" />
    </Helmet>
    <main className={styles.home}>
      <div className={styles.bgWrap}>
        <img src="/photo.jpg" alt="Александр Дин" className={styles.bgImg} />
        <div className={styles.overlay} />
      </div>

      <div ref={contentRef} className={styles.content}>
        <p ref={subtitleRef} className={styles.subtitle}>
          Ведущий мероприятий
        </p>
        <h1 ref={nameRef} className={styles.name}>
          АЛЕКСАНДР<br />ДИН
        </h1>
        <div ref={dividerRef} className={styles.divider} />
        <p className={styles.chooseLabel}>Выберите раздел</p>
        <div ref={buttonsRef} className={styles.buttons}>
          <Link to="/weddings" className={styles.btnOutline}>Свадьбы</Link>
          <Link to="/corporate" className={styles.btnFilled}>Корпоративы</Link>
        </div>
      </div>

    </main>
    </>
  );
}
