# Главная страница (Home)

Точка входа сайта (маршрут `/`, компонент `client/src/pages/Home.jsx`).
Полноэкранный hero-блок с фото ведущего и выбором раздела — минималистичная
страница-развилка без прокручиваемого контента.

## Ключевые факты
- Перед первым рендером на `/` показывается [[shared-ui-components|Loader]]
  (прелоадер со счётчиком 0→100%, GSAP) — но только на главной и не на
  `/admin*`.
- Тексты через `useContent()` (ключи `home.*`): подзаголовок, имя (с
  переносом строки через `\n`), подпись «Выберите раздел», тексты кнопок —
  см. [[content-management-system]].
- Две кнопки-ссылки ведут на [[weddings-page]] и [[corporate-page]].
- Фоновая картинка — `/photo.jpg` (статика из `client/public`).
- GSAP-таймлайн анимирует появление подзаголовка → имени → разделителя →
  кнопок при монтировании.
- Страница запрашивает `GET /api/sections` (с фолбэком на хардкод
  «Свадьбы»/«Корпоративы» при ошибке), но результат (`sections` в state)
  нигде не используется в JSX — похоже на неиспользуемый/недоделанный код.
- SEO через `react-helmet-async`: title, description, canonical
  `https://din-aleksndr.kz/`, OG-теги — ключи `home.seo.title` /
  `home.seo.description`.

## Cross-references
- [[site-overview]]
- [[weddings-page]]
- [[corporate-page]]
- [[content-management-system]]
- [[shared-ui-components]]
- [[seo-content]]

## Sources
- client/src/pages/Home.jsx
- client/src/pages/Home.module.css
- server/index.js (`GET /api/sections`)
