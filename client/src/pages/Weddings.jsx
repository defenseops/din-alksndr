import { useState } from 'react';
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
import NavMenu from '../components/NavMenu';
import styles from './Weddings.module.css';

const YT_ID = 'nmjFyDe8vcw';

export default function Weddings() {
  const [introDone, setIntroDone] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <>
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
              src={`https://www.youtube.com/embed/${YT_ID}?autoplay=1`}
              allow="autoplay; fullscreen"
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
          <p className={styles.headerName}>АЛЕКСАНДР</p>
          <p className={styles.headerName}>ДИН</p>
          <p className={styles.headerSubtitle}>Ведущий мероприятий</p>
        </div>

        <div className={styles.textBlock}>
          <h1 className={styles.title}>
            АЛЕКСАНДР<br />ДИН
          </h1>
          <p className={styles.subtitle}>Ведущий мероприятий</p>
          <button className={styles.applyBtn} onClick={() => setQuizOpen(true)}>
            Подать заявку
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
    </>
  );
}
