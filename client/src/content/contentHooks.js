import { useContext } from 'react';
import { ContentCtx } from './context';

// value с бэкенда, если ключ есть, иначе fallback — текущий хардкод-текст, чтобы сайт
// рендерился как обычно, пока API ещё не ответил или ключа нет в базе.
export function useContent(key, fallback) {
  const { content } = useContext(ContentCtx);
  return content[key] !== undefined ? content[key] : fallback;
}

export function useVideos(section, fallback) {
  const { videos } = useContext(ContentCtx);
  const rows = videos[section];
  return rows && rows.length ? rows : fallback;
}

// Нормализует и БД-фото, и fallback к единому виду {src, wide}.
export function usePhotos(section, fallback) {
  const { photos } = useContext(ContentCtx);
  const rows = photos[section];
  if (rows && rows.length) {
    return rows.map((r) => ({ src: r.file_path, wide: !!r.wide }));
  }
  return fallback;
}

export function useContentReady() {
  return useContext(ContentCtx).loaded;
}
