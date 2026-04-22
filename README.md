# Александр Дин — Сайт ведущего мероприятий

Сайт-портфолио ведущего свадеб и корпоративных мероприятий.

## Стек

- **Frontend:** React 19, Vite, CSS Modules, GSAP
- **Backend:** Node.js, Express 5
- **Деплой:** Docker

## Структура

```
├── client/        # React-приложение
├── server/        # Express API
├── Dockerfile
└── docker-compose.yml
```

## Страницы

- `/` — главная
- `/weddings` — свадьбы
- `/corporate` — корпоративы

## Запуск локально

```bash
# Клиент
cd client && npm install && npm run dev

# Сервер
cd server && npm install && node index.js
```

## Деплой через Docker

```bash
# Заполнить переменные окружения
cp server/.env.example server/.env

# Запуск
docker compose up -d --build
```

## Переменные окружения

Файл `server/.env`:

| Переменная       | Описание                        |
|------------------|---------------------------------|
| `TG_TOKEN`       | Токен Telegram-бота             |
| `TG_CHAT_ID`     | ID чата для получения заявок    |
| `ALLOWED_ORIGIN` | Домен сайта (CORS)              |
| `PORT`           | Порт сервера (по умолчанию 3001)|
