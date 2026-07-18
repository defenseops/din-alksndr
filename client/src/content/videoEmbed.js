export function videoEmbedUrl(video, { autoplay = false } = {}) {
  if (!video) return '';
  switch (video.provider) {
    case 'youtube':
      return `https://www.youtube.com/embed/${video.external_id}${autoplay ? '?autoplay=1' : ''}`;
    case 'yandex':
      return `https://disk.yandex.ru/video/embed/${video.external_id}`;
    case 'gdrive':
      return `https://drive.google.com/file/d/${video.external_id}/preview`;
    default:
      return '';
  }
}

export function youtubeThumbnail(video) {
  if (!video || video.provider !== 'youtube') return null;
  return `https://img.youtube.com/vi/${video.external_id}/hqdefault.jpg`;
}
