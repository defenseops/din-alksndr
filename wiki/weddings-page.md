# Страница «Свадьбы» (Weddings)

Маршрут `/weddings` (`client/src/pages/Weddings.jsx`) — самая длинная
страница сайта, полноценный лендинг для свадебной аудитории: интро-заставка,
hero с видео, галерея, квиз-форма, отзывы, контакты.

## Ключевые факты
- Порядок секций сверху вниз: [[shared-ui-components|WeddingsIntro]]
  (заставка) → гамбургер-меню + [[shared-ui-components|NavMenu]] → hero
  (фон `/about.jpg`, имя, кнопка «Подать заявку» открывает
  [[lead-form-quiz|QuizModal]], [[shared-ui-components|PlayButton]] открывает
  модалку с hero-видео) → TagsMarquee (бегущая строка тегов) → AboutBlock
  («Обо мне», текст со своим скроллом внутри блока и вращением
  иконки-звезды по wheel-событию) → [[video-system|VideoBlock]] →
  [[photo-gallery-system|GalleryBlock]] → [[lead-form-quiz|QuizBlock]]
  (встроенный в страницу, не модалка) → BenefitsBlock («Что вы получите» —
  4 карточки) → ReviewsBlock (видео-отзывы) → WeddingsCTA →
  WeddingsContacts.
- Hero-видео = первое (по `sort_order`) видео секции `weddings_reel` — тот
  же список, что рендерит `VideoBlock`; сделано намеренно, чтобы админ
  управлял этим видео в одном месте (см. комментарий в коде).
- Почти весь текст редактируем через ключи `weddings.*` — см.
  [[content-management-system]].
- SEO: title/description для `/weddings`, canonical, OG — ключи
  `weddings.seo.*`.

## Cross-references
- [[site-overview]]
- [[content-management-system]]
- [[video-system]]
- [[photo-gallery-system]]
- [[lead-form-quiz]]
- [[shared-ui-components]]
- [[seo-content]]

## Sources
- client/src/pages/Weddings.jsx
- client/src/components/WeddingsIntro.jsx
- client/src/components/AboutBlock.jsx
- client/src/components/VideoBlock.jsx
- client/src/components/GalleryBlock.jsx
- client/src/components/QuizBlock.jsx
- client/src/components/BenefitsBlock.jsx
- client/src/components/ReviewsBlock.jsx
- client/src/components/WeddingsCTA.jsx
- client/src/components/WeddingsContacts.jsx
- client/src/components/TagsMarquee.jsx
- client/src/components/PlayButton.jsx
- client/src/components/NavMenu.jsx
