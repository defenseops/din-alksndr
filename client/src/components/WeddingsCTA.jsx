import { useState } from 'react';
import { useContent } from '../content/contentHooks';
import styles from './WeddingsCTA.module.css';
import QuizModal from './QuizModal';

export default function WeddingsCTA() {
  const [open, setOpen] = useState(false);
  const heading = useContent('weddings.cta.heading', 'СДЕЛАЕМ ЛУЧШУЮ СВАДЬБУ ВМЕСТЕ');
  const btn = useContent('weddings.cta.btn', 'Подать заявку');

  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.heading}>{heading}</h2>
        <button className={styles.btn} onClick={() => setOpen(true)}>{btn}</button>
      </section>
      <QuizModal open={open} onClose={() => setOpen(false)} source="Свадьбы" />
    </>
  );
}
