import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import CorporateIntro from '../components/CorporateIntro';
import NavMenu from '../components/NavMenu';
import PlayButton from '../components/PlayButton';
import QuizModal from '../components/QuizModal';
import CorporateVideoBlock from '../components/CorporateVideoBlock';
import CorporateAbout from '../components/CorporateAbout';
import CorporateGallery from '../components/CorporateGallery';
import CorporateBenefits from '../components/CorporateBenefits';
import CorporateTrust from '../components/CorporateTrust';
import CorporateCTA from '../components/CorporateCTA';
import CorporateContacts from '../components/CorporateContacts';
import QuizBlock from '../components/QuizBlock';
import { useContent, useVideos } from '../content/contentHooks';
import { videoEmbedUrl } from '../content/videoEmbed';
import styles from './Corporate.module.css';

const FALLBACK_HERO_VIDEO = [{ id: 1, provider: 'youtube', external_id: '680OIw2WA1A', title: 'КОРПОРАТИВ\nДЛЯ BCC' }];

const FALLBACK_NAV_LINKS = [
  { label: 'ГЛАВНАЯ', to: '/' },
  { label: 'СВАДЬБЫ', to: '/weddings' },
  { label: 'КОРПОРАТИВЫ', to: '/corporate' },
];

export default function Corporate() {
  const [introDone, setIntroDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const { pathname } = useLocation();

  const navLinks = useContent('nav.links', FALLBACK_NAV_LINKS);
  const seoTitle = useContent('corporate.seo.title', 'Ведущий корпоративов Александр Дин — Казахстан');
  const seoDescription = useContent('corporate.seo.description', 'Александр Дин — ведущий корпоративных мероприятий в Казахстане. Профессиональный подход, харизма и точный сценарий под ваш формат.');
  const heroTitle = useContent('corporate.hero.title', 'АЛЕКСАНДР ДИН');
  const heroSubtitle = useContent('corporate.hero.subtitle', 'Ведущий мероприятий');
  // hero-видео = первое видео секции corporate_reel — тот же список, что
  // показывает CorporateVideoBlock ниже, чтобы админ управлял им в одном месте.
  const [heroVideo] = useVideos('corporate_reel', FALLBACK_HERO_VIDEO);

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href="https://din-aleksndr.kz/corporate" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content="https://din-aleksndr.kz/corporate" />
      </Helmet>
      {!introDone && <CorporateIntro onComplete={() => setIntroDone(true)} />}

      <header className={styles.navHeader}>
        <nav className={styles.navList}>
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`${styles.navLink} ${pathname === to ? styles.navLinkActive : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>

      <button className={styles.hamburger} onClick={() => setMenuOpen(true)}>
        <span /><span /><span />
      </button>

      <NavMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <QuizModal open={quizOpen} onClose={() => setQuizOpen(false)} source="Корпоративы" />

      {videoOpen && (
        <div className={styles.videoModal} onClick={() => setVideoOpen(false)}>
          <div className={styles.videoModalInner} onClick={e => e.stopPropagation()}>
            <button className={styles.videoModalClose} onClick={() => setVideoOpen(false)}>✕</button>
            <iframe
              src={videoEmbedUrl(heroVideo, { autoplay: true })}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className={styles.videoModalIframe}
            />
          </div>
        </div>
      )}

      <section className={styles.hero}>
        <div className={styles.brandMark}>
          <img src="/logo.png" alt="Логотип" className={styles.logoImg} />
          <p className={styles.brandName}>{heroTitle}</p>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>{heroTitle}</h1>
            <p className={styles.subtitle}>{heroSubtitle}</p>
          </div>

          <div className={styles.heroActions}>
            <PlayButton accentColor="#c01515" onClick={() => setVideoOpen(true)} />
            <button className={styles.orderBtn} onClick={() => setQuizOpen(true)}>Заказать</button>
          </div>
        </div>

        <div className={styles.photoArea}>
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
