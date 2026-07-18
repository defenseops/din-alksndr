import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Helmet } from 'react-helmet-async';
import { useContent } from '../content/contentHooks';
import styles from './Home.module.css';

export default function Home() {
  const contentRef = useRef(null);
  const subtitleRef = useRef(null);
  const nameRef = useRef(null);
  const dividerRef = useRef(null);
  const buttonsRef = useRef(null);
  const [sections, setSections] = useState([]);

  const seoTitle = useContent('home.seo.title', 'Александр Дин — Ведущий мероприятий в Казахстане');
  const seoDescription = useContent('home.seo.description', 'Александр Дин — профессиональный ведущий свадеб и корпоративных мероприятий в Казахстане. Яркие эмоции, безупречная организация.');
  const heroSubtitle = useContent('home.hero.subtitle', 'Ведущий мероприятий');
  const heroName = useContent('home.hero.name', 'АЛЕКСАНДР\nДИН');
  const chooseLabel = useContent('home.hero.chooseLabel', 'Выберите раздел');
  const btnWeddings = useContent('home.hero.btnWeddings', 'Свадьбы');
  const btnCorporate = useContent('home.hero.btnCorporate', 'Корпоративы');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/sections`)
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
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <link rel="canonical" href="https://din-aleksndr.kz/" />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:url" content="https://din-aleksndr.kz/" />
    </Helmet>
    <main className={styles.home}>
      <div className={styles.bgWrap}>
        <img src="/photo.jpg" alt="Александр Дин" className={styles.bgImg} />
        <div className={styles.overlay} />
      </div>

      <div ref={contentRef} className={styles.content}>
        <p ref={subtitleRef} className={styles.subtitle}>
          {heroSubtitle}
        </p>
        <h1 ref={nameRef} className={styles.name}>
          {heroName.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
        </h1>
        <div ref={dividerRef} className={styles.divider} />
        <p className={styles.chooseLabel}>{chooseLabel}</p>
        <div ref={buttonsRef} className={styles.buttons}>
          <Link to="/weddings" className={styles.btnOutline}>{btnWeddings}</Link>
          <Link to="/corporate" className={styles.btnFilled}>{btnCorporate}</Link>
        </div>
      </div>

    </main>
    </>
  );
}
