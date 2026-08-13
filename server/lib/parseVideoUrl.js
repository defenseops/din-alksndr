// Распознаёт ссылку на YouTube / Yandex.Disk / Google Drive и достаёт provider+external_id.
function parseVideoUrl(rawUrl) {
  if (typeof rawUrl !== 'string' || !rawUrl.trim()) return null;

  let url;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, '');

  // youtu.be/<id>
  if (host === 'youtu.be') {
    const id = url.pathname.split('/').filter(Boolean)[0];
    return id ? { provider: 'youtube', external_id: id } : null;
  }

  // youtube.com/watch?v=<id> | /shorts/<id> | /embed/<id> | /live/<id>
  if (host === 'youtube.com' || host === 'm.youtube.com') {
    if (url.pathname === '/watch') {
      const id = url.searchParams.get('v');
      return id ? { provider: 'youtube', external_id: id } : null;
    }
    const parts = url.pathname.split('/').filter(Boolean);
    if ((parts[0] === 'shorts' || parts[0] === 'embed' || parts[0] === 'live') && parts[1]) {
      return { provider: 'youtube', external_id: parts[1] };
    }
    return null;
  }

  // Только настоящие публичные ссылки Яндекс.Диска: /i/<id> (файл), /d/<id> (папка),
  // /video/embed/<id> (уже embed-ссылка). Всё остальное — например /client/disk/...,
  // который получается, если скопировать URL из адресной строки при просмотре СВОИХ
  // файлов в браузере, — не публичная ссылка и рабочий embed из неё не собрать, поэтому
  // раньше это тихо принималось как "ID" из мусорного куска пути. Теперь отклоняем явно.
  if (host.startsWith('disk.yandex.')) {
    const parts = url.pathname.split('/').filter(Boolean);
    if ((parts[0] === 'i' || parts[0] === 'd') && parts[1]) {
      return { provider: 'yandex', external_id: parts[1] };
    }
    if (parts[0] === 'video' && parts[1] === 'embed' && parts[2]) {
      return { provider: 'yandex', external_id: parts[2] };
    }
    return null;
  }

  // drive.google.com/file/d/<id>/... | /open?id=<id> | /uc?id=<id>
  if (host === 'drive.google.com') {
    const parts = url.pathname.split('/').filter(Boolean);
    const dIdx = parts.indexOf('d');
    if (dIdx !== -1 && parts[dIdx + 1]) {
      return { provider: 'gdrive', external_id: parts[dIdx + 1] };
    }
    const qId = url.searchParams.get('id');
    return qId ? { provider: 'gdrive', external_id: qId } : null;
  }

  return null;
}

module.exports = { parseVideoUrl };
