import { useEffect } from 'react';
import QuizBlock from './QuizBlock';
import styles from './QuizModal.module.css';

export default function QuizModal({ open, onClose }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.inner} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        <QuizBlock />
      </div>
    </div>
  );
}
