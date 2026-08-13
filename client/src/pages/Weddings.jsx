import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PlayButton from '../components/PlayButton';
import WeddingsIntro from '../components/WeddingsIntro';
import AboutBlock from '../components/AboutBlock';
import VideoBlock from '../components/VideoBlock';
import GalleryBlock from '../components/GalleryBlock';
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
  const applyBtn = useContent('weddings.hero.applyBtn', 'Проверить дату');
  const callbackLabel = useContent('weddings.hero.callbackLabel', 'обратный звонок');
  const quote = useContent('weddings.hero.quote', 'Все были уверены, что ты наш друг');
  const quoteAuthor = useContent('weddings.hero.quoteAuthor', '— мои пары');
  // те же ключи, что и в WeddingsContacts — один источник правды для номера/WhatsApp
  const phoneDisplay = useContent('weddings.contacts.phoneDisplay', '8 (707) 493-57-82');
  const whatsapp = useContent('weddings.contacts.whatsapp', 'https://wa.me/77074935782');

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
        <div className={styles.topBar}>
          <div className={styles.brandMark}>
            <img src="/logo.png" alt="Логотип" className={styles.logoImg} />
            <p className={styles.brandName}>{heroName.replace(/\n/g, ' ')}</p>
          </div>

          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.callBlock}
          >
            <svg className={styles.callIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className={styles.callText}>
              <span className={styles.callPhone}>{phoneDisplay}</span>
              <span className={styles.callLabel}>{callbackLabel}</span>
            </span>
          </a>
        </div>

        <div className={styles.photoBlock}>
          <img src="/about.jpg" alt="" className={styles.bgImg} />
          <div className={styles.photoFade} />

          <div className={styles.playWrap}>
            <PlayButton onClick={() => setVideoOpen(true)} />
          </div>
        </div>

        <div className={styles.textPanel}>
          <div className={styles.textBlock}>
            <h1 className={styles.title}>
              {heroName.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
            </h1>
            <p className={styles.subtitle}>{heroSubtitle}</p>
            <p className={styles.quote}>
              &quot;{quote}&quot;
              <span className={styles.quoteAuthor}>{quoteAuthor}</span>
            </p>
            <button className={styles.applyBtn} onClick={() => setQuizOpen(true)}>
              {applyBtn}
            </button>
          </div>
        </div>

        <div className={styles.heroCurve} aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,100 Q720,0 1440,100 Z" fill="#fff" />
          </svg>
        </div>
      </section>

      <AboutBlock />
      <VideoBlock />
      <GalleryBlock />
      <BenefitsBlock />
      <ReviewsBlock />
      <WeddingsCTA />
      <WeddingsContacts />
    </>
  );
}
