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
import NavMenu from '../components/NavMenu';
import styles from './Weddings.module.css';

export default function Weddings() {
  const [introDone, setIntroDone] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {!introDone && <WeddingsIntro onComplete={() => setIntroDone(true)} />}

      {/* hamburger */}
      <button className={styles.hamburger} onClick={() => setMenuOpen(true)}>
        <span /><span /><span />
      </button>

      <NavMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <QuizModal open={quizOpen} onClose={() => setQuizOpen(false)} />

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
          <PlayButton />
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
    </>
  );
}
