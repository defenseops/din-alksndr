import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import CorporateIntro from '../components/CorporateIntro';
import NavMenu from '../components/NavMenu';
import CorporateVideoBlock from '../components/CorporateVideoBlock';
import CorporateAbout from '../components/CorporateAbout';
import CorporateGallery from '../components/CorporateGallery';
import CorporateBenefits from '../components/CorporateBenefits';
import CorporateTrust from '../components/CorporateTrust';
import CorporateCTA from '../components/CorporateCTA';
import CorporateContacts from '../components/CorporateContacts';
import QuizBlock from '../components/QuizBlock';
import styles from './Corporate.module.css';

export default function Corporate() {
  const [introDone, setIntroDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const circleRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const circle = circleRef.current;
    if (!hero || !circle) return;

    const onScroll = () => {
      const rect = hero.getBoundingClientRect();
      const heroH = hero.offsetHeight;
      // progress: 0 когда top секции = 0, 1 когда секция ушла за верх
      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / heroH, 0), 1);

      const startSize = window.innerHeight * 0.7;
      const endSize = Math.max(window.innerWidth, window.innerHeight) * 2.8;
      const size = startSize + (endSize - startSize) * progress;

      circle.style.width = `${size}px`;
      circle.style.height = `${size}px`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [introDone]);

  return (
    <>
      <Helmet>
        <title>Ведущий корпоративов Александр Дин — Казахстан</title>
        <meta name="description" content="Александр Дин — ведущий корпоративных мероприятий в Казахстане. Профессиональный подход, харизма и точный сценарий под ваш формат." />
        <link rel="canonical" href="https://din-aleksndr.kz/corporate" />
        <meta property="og:title" content="Ведущий корпоративов Александр Дин — Казахстан" />
        <meta property="og:description" content="Александр Дин — ведущий корпоративных мероприятий в Казахстане. Профессиональный подход, харизма и точный сценарий под ваш формат." />
        <meta property="og:url" content="https://din-aleksndr.kz/corporate" />
      </Helmet>
      {!introDone && <CorporateIntro onComplete={() => setIntroDone(true)} />}

      <button className={styles.hamburger} onClick={() => setMenuOpen(true)}>
        <span /><span /><span />
      </button>

      <NavMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <section className={styles.hero} ref={heroRef}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>АЛЕКСАНДР ДИН</h1>
          <p className={styles.subtitle}>Ведущий мероприятий</p>
        </div>

        <div className={styles.photoArea}>
          <div className={styles.circle} ref={circleRef} />
          <img src="/alex-corp.png" alt="Александр Дин" className={styles.photo} />
        </div>
      </section>

      <CorporateVideoBlock />
      <CorporateAbout />
      <CorporateGallery />
      <QuizBlock dark source="Корпоративы" />
      <CorporateBenefits />
      <CorporateTrust />
      <CorporateCTA />
      <CorporateContacts />
    </>
  );
}
