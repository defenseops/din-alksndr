import { useContent } from '../content/contentHooks';
import styles from './CorporateAbout.module.css';

const FALLBACK_PARAGRAPHS = [
  'Меня зовут Александр Дин, я — ведущий мероприятий.',
  'В ивент-сфере уже более 7 лет и сегодня профессионально провожу события для крупнейших компаний Казахстана и международных брендов.',
  'Какое-то время успел побывать в сфере продаж и управления, поэтому хорошо понимаю чего ждут Ваши коллеги от совместного праздника.',
  'Самое главное, что хочется донести — я искренне люблю свою работу и делаю всё, чтобы Вы тоже любили свою.',
  'Уверен, наш общий корпоратив станет для этого отличным поводом :)\nЧтобы это проверить — оставляйте заявку на сайте.',
  'Буду рад встрече!',
];

export default function CorporateAbout() {
  const heading = useContent('corporate.about.heading', 'ДАВАЙТЕ\nЗНАКОМИТЬСЯ!');
  const paragraphs = useContent('corporate.about.paragraphs', FALLBACK_PARAGRAPHS);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.photoWrap}>
          <img src="/alex-115.jpg" alt="Александр Дин" className={styles.photo} />
        </div>

        <div className={styles.text}>
          <h2 className={styles.heading}>{heading.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</h2>
          <div className={styles.body}>
            {paragraphs.map((p, i) => (
              <p key={i}>{p.split('\n').map((line, j) => <span key={j}>{line}{j < p.split('\n').length - 1 && <br />}</span>)}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
