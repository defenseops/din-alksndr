import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PlayButton from '../components/PlayButton';
import WeddingsIntro from '../components/WeddingsIntro';
import TagsMarquee from '../components/TagsMarquee';
import AboutBlock from '../components/AboutBlock';
import VideoBlock from '../components/VideoBlock';
import GalleryBlock from '../components/GalleryBlock';
import QuizBlock from '../components/QuizBlock';
import QuizModal from '../components/QuizModal';
import BenefitsBlock from '../components/BenefitsBlock';
import ReviewsBlock from '../components/ReviewsBlock';
import WeddingsCTA from '../components/WeddingsCTA';
import WeddingsContacts from '../components/WeddingsContacts';
import NavMenu from '../components/NavMenu';
import { useContent, useVideos } from '../content/contentHooks';
import { videoEmbedUrl } from '../content/videoEmbed';
import styles from './Weddings.module.css';

const FALLBACK_HERO_VIDEO = [{ id: 1, provider: 'youtube', external_id: 'nmjFyDe8vcw' }];

export default function Weddings() {
  const [introDone, setIntroDone] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  // hero-видео = первое (по порядку) видео из секции weddings_reel — тот же список,
  // что показывает VideoBlock, чтобы админ управлял этим видео в одном месте.
  const [heroVideo] = useVideos('weddings_reel', FALLBACK_HERO_VIDEO);

  const seoTitle = useContent('weddings.seo.title', 'Свадебный ведущий Александр Дин — Казахстан');
  const seoDescription = useContent('weddings.seo.description', 'Александр Дин — ведущий свадеб в Казахстане. Тёплая атмосфера, живые эмоции и безупречный сценарий вашего торжества.');
  const heroName = useContent('weddings.hero.name', 'АЛЕКСАНДР\nДИН');
  const heroSubtitle = useContent('weddings.hero.subtitle', 'Ведущий мероприятий');
  const applyBtn = useContent('weddings.hero.applyBtn', 'Подать заявку');

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href="https://din-aleksndr.kz/weddings" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content="https://din-aleksndr.kz/weddings" />
      </Helmet>
      {!introDone && <WeddingsIntro onComplete={() => setIntroDone(true)} />}

      {/* hamburger */}
      <button className={styles.hamburger} onClick={() => setMenuOpen(true)}>
        <span /><span /><span />
      </button>

      <NavMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <QuizModal open={quizOpen} onClose={() => setQuizOpen(false)} />

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

      <section className={styles.weddings}>
        <div className={styles.bgWrap}>
          <img src="/about.jpg" alt="" className={styles.bgImg} />
          <div className={styles.overlay} />
        </div>

        <div className={styles.header}>
          {heroName.split('\n').map((line, i) => <p key={i} className={styles.headerName}>{line}</p>)}
          <p className={styles.headerSubtitle}>{heroSubtitle}</p>
        </div>

        <div className={styles.textBlock}>
          <h1 className={styles.title}>
            {heroName.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
          </h1>
          <p className={styles.subtitle}>{heroSubtitle}</p>
          <button className={styles.applyBtn} onClick={() => setQuizOpen(true)}>
            {applyBtn}
          </button>
        </div>

        <div className={styles.playWrap}>
          <PlayButton onClick={() => setVideoOpen(true)} />
        </div>
      </section>

      <section className={styles.marqueeSection}>
        <TagsMarquee />
      </section>

      <AboutBlock />
      <VideoBlock />
      <GalleryBlock />
      <QuizBlock />
      <BenefitsBlock />
      <ReviewsBlock />
      <WeddingsCTA />
      <WeddingsContacts />
    </>
  );
}
