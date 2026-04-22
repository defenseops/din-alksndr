import { useRef, useEffect } from 'react';
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
  const photoRef = useReveal();
  const contentRef = useReveal();

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const onWheel = (e) => {
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
      const atTop = el.scrollTop <= 0;

      if ((e.deltaY > 0 && atBottom) || (e.deltaY < 0 && atTop)) return;

      e.preventDefault();
      el.scrollTop += e.deltaY;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <section className={styles.about}>
      <div className={styles.spacer} />
      <div className={`${styles.photoWrap} reveal-left`} ref={photoRef}>
        <img src="/alex-41.jpg" alt="Александр Дин" className={styles.photo} />
      </div>

      <div className={`${styles.textWrap} reveal-right`} ref={contentRef}>
        <h2 className={styles.heading}>ОБО МНЕ</h2>
        <div className={styles.body} ref={textRef}>
          {TEXT.split('\n').map((line, i) => (
            <p key={i} className={styles.line}>{line}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
