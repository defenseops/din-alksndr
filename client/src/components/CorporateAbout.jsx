import { useState } from 'react';
import styles from './CorporateAbout.module.css';

export default function CorporateAbout() {
  const [liked, setLiked] = useState(false);
  const [commented, setCommented] = useState(false);
  const [shared, setShared] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showThanks, setShowThanks] = useState(false);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setShowThanks(true);
      setTimeout(() => setShowThanks(false), 3000);
    } else {
      setLiked(false);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <img src="/avatar.jpg" alt="Александр Дин" className={styles.avatar} />
            <div className={styles.headerInfo}>
              <a href="https://www.instagram.com/din.alksndr?igsh=Nm05aW14ZXBuMjUz" target="_blank" rel="noopener noreferrer" className={styles.username}>din.alksndr</a>
              <span className={styles.location}>Алматы, Казахстан</span>
            </div>
          </div>

          <div className={styles.photoWrap}>
            <img src="/alex-115.jpg" alt="Александр Дин" className={styles.photo} />
          </div>

          <div className={styles.actions}>
            <div className={styles.leftActions}>
              <button
                className={`${styles.actionBtn} ${liked ? styles.liked : ''}`}
                onClick={handleLike}
                aria-label="Лайк"
              >
                <svg viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
              <button
                className={`${styles.actionBtn} ${commented ? styles.commented : ''}`}
                onClick={() => setCommented(v => !v)}
                aria-label="Комментарий"
              >
                <svg viewBox="0 0 24 24" fill={commented ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </button>
              <button
                className={`${styles.actionBtn} ${shared ? styles.shared : ''}`}
                onClick={() => setShared(v => !v)}
                aria-label="Поделиться"
              >
                <svg viewBox="0 0 24 24" fill={shared ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <button
              className={`${styles.actionBtn} ${saved ? styles.saved : ''}`}
              onClick={() => setSaved(v => !v)}
              aria-label="Сохранить"
            >
              <svg viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <polygon points="19 21 12 16 5 21 5 3 19 3 19 21" />
              </svg>
            </button>
          </div>

          <div className={styles.thanks} style={{ opacity: showThanks ? 1 : 0 }}>
            Ой, спасибо, вы тоже супер!
          </div>
        </div>

        <div className={styles.text}>
          <h2 className={styles.heading}>ДАВАЙТЕ<br />ЗНАКОМИТЬСЯ!</h2>
          <div className={styles.body}>
            <p>Меня зовут Александр Дин, я — ведущий мероприятий.</p>
            <p>В ивент-сфере уже более 7 лет и сегодня профессионально провожу события для крупнейших компаний Казахстана и международных брендов.</p>
            <p>Какое-то время успел побывать в сфере продаж и управления, поэтому хорошо понимаю чего ждут Ваши коллеги от совместного праздника.</p>
            <p>Самое главное, что хочется донести — я искренне люблю свою работу и делаю всё, чтобы Вы тоже любили свою.</p>
            <p>Уверен, наш общий корпоратив станет для этого отличным поводом :)<br />Чтобы это проверить — оставляйте заявку на сайте.</p>
            <p>Буду рад встрече!</p>
          </div>
        </div>
      </div>
    </section>
  );
}
