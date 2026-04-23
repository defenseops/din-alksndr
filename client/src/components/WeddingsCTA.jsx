import { useState } from 'react';
import styles from './WeddingsCTA.module.css';
import QuizModal from './QuizModal';

export default function WeddingsCTA() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.heading}>СДЕЛАЕМ ЛУЧШУЮ СВАДЬБУ ВМЕСТЕ</h2>
        <button className={styles.btn} onClick={() => setOpen(true)}>Подать заявку</button>
      </section>
      <QuizModal open={open} onClose={() => setOpen(false)} source="Свадьбы" />
    </>
  );
}
