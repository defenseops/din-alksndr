# Александр Дин — сайт-портфолио ведущего мероприятий

Сайт-визитка ведущего свадеб и корпоративных мероприятий в Казахстане (домен
`din-aleksndr.kz`). Full-stack проект: React-клиент (SPA) + Express-сервер с
SQLite, где все тексты, фото и видео редактируются через встроенную админку
без правки кода и деплоя.

## Ключевые факты
- Домен: `https://din-aleksndr.kz`; локация ведущего — Алматы, Казахстан.
- Три публичные страницы: [[home-page]] (`/`), [[weddings-page]] (`/weddings`),
  [[corporate-page]] (`/corporate`).
- Админка на `/admin` (см. [[admin-panel]]) — управление текстами, фото и
  видео без изменения кода.
- Монорепозиторий: `client/` (React 19 + Vite) и `server/` (Node/Express 5),
  см. [[tech-stack-deployment]].
- Весь контент (тексты, фото, видео) хранится в SQLite и отдаётся клиенту
  через единый набор API-эндпоинтов — см. [[content-management-system]].
- Главная бизнес-цель сайта — сбор заявок (лидов) через трёхшаговый квиз,
  см. [[lead-form-quiz]].
- Деплой — один Docker-контейнер: тот же Express-процесс отдаёт и API, и
  собранную статику клиента.
- Установлена Яндекс.Метрика (webvisor, clickmap) — см. [[seo-content]].

## Cross-references
- [[home-page]]
- [[weddings-page]]
- [[corporate-page]]
- [[admin-panel]]
- [[content-management-system]]
- [[lead-form-quiz]]
- [[tech-stack-deployment]]
- [[server-api]]
- [[seo-content]]

## Sources
- README.md
- client/src/App.jsx
