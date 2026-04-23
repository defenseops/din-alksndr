import { useRef, useEffect, useState } from 'react';
import useReveal from '../hooks/useReveal';
import styles from './AboutBlock.module.css';

const TEXT = `Привет!
Если в двух словах:
Я — ведущий.
Ещё в двух:
Хороший ведущий.
Чуть побольше слов:
Я самый «свойский» ведущий в мире.
У меня нет громких званий, императорских регалий и 100500 лет опыта.
Я просто искренне люблю свою работу и людей, с которыми она происходит.
Искренность — мой принцип.
— Именно поэтому на моих свадьбах всего два состояния — очень весело и очень трогательно. И чаще всего этого вполне достаточно, чтобы назвать свадьбу — лучшей.
— Именно поэтому гости часто уверены, что я давний друг молодожёнов. Хотя видимся мы с ними впервые в жизни.
— Именно поэтому мы потом действительно становимся друзьями с теми, кто доверяет мне свой праздник. И не один.
И, может быть, именно поэтому вы сейчас читаете этот текст :)
Если после прочтения у вас что-то откликнулось в сердечке — возможно, стоит провериться у кардиолога.`;

export default function AboutBlock() {
  const textRef = useRef(null);
  const starRef = useRef(null);
  const rotationRef = useRef(0);
  const photoRef = useReveal();
  const contentRef = useReveal();
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const onScroll = () => {
      setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 4);
    };

    const onWheel = (e) => {
      rotationRef.current += e.deltaY * 0.3;
      if (starRef.current) {
        starRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
      }
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('wheel', onWheel);
    };
  }, []);

  return (
    <section className={styles.about}>
      <div className={styles.spacer} />
      <div className={`${styles.photoWrap} reveal-left`} ref={photoRef}>
        <img src="/alex-41.jpg" alt="Александр Дин" className={styles.photo} />
      </div>

      <div className={`${styles.textWrap} reveal-right`} ref={contentRef}>
        <div className={styles.headingRow}>
          <h2 className={styles.heading}>ОБО МНЕ</h2>
          <img src="/icon-star.png" alt="" className={styles.star} ref={starRef} />
        </div>
        <div className={styles.bodyWrap}>
          <div className={styles.body} ref={textRef}>
            {TEXT.split('\n').map((line, i) => (
              <p key={i} className={styles.line}>{line}</p>
            ))}
          </div>
          {!atBottom && (
            <div className={styles.scrollHint}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
