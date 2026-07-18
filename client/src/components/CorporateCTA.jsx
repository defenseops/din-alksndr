import { useState } from 'react';
import { useContent } from '../content/contentHooks';
import styles from './CorporateCTA.module.css';
import QuizModal from './QuizModal';

export default function CorporateCTA() {
  const [open, setOpen] = useState(false);
  const heading = useContent('corporate.cta.heading', '95% ЛЮДЕЙ СТАНОВЯТСЯ СЧАСТЛИВЕЕ\nПРИ НАЖАТИИ НА ЭТУ КНОПКУ');
  const btn = useContent('corporate.cta.btn', 'Нажать на кнопку');

  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.heading}>{heading.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</h2>
        <button className={styles.btn} onClick={() => setOpen(true)}>{btn}</button>
      </section>
      <QuizModal open={open} onClose={() => setOpen(false)} source="Корпоративы" />
    </>
  );
}
