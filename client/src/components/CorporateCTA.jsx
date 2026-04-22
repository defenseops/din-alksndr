import { useState } from 'react';
import styles from './CorporateCTA.module.css';
import QuizModal from './QuizModal';

export default function CorporateCTA() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.heading}>95% ЛЮДЕЙ СТАНОВЯТСЯ СЧАСТЛИВЕЕ<br />ПРИ НАЖАТИИ НА ЭТУ КНОПКУ</h2>
        <button className={styles.btn} onClick={() => setOpen(true)}>Нажать на кнопку</button>
      </section>
      <QuizModal open={open} onClose={() => setOpen(false)} source="Корпоративы" />
    </>
  );
}
