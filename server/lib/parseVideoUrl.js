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

  // youtube.com/watch?v=<id> | youtube.com/shorts/<id> | youtube.com/embed/<id>
  if (host === 'youtube.com' || host === 'm.youtube.com') {
    if (url.pathname === '/watch') {
      const id = url.searchParams.get('v');
      return id ? { provider: 'youtube', external_id: id } : null;
    }
    const parts = url.pathname.split('/').filter(Boolean);
    if ((parts[0] === 'shorts' || parts[0] === 'embed') && parts[1]) {
      return { provider: 'youtube', external_id: parts[1] };
    }
    return null;
  }

  // disk.yandex.ru|kz/... , или уже готовый embed disk.yandex.ru/video/embed/<id>
  if (host.startsWith('disk.yandex.')) {
    const parts = url.pathname.split('/').filter(Boolean);
    const id = parts[parts.length - 1];
    return id ? { provider: 'yandex', external_id: id } : null;
  }

  // drive.google.com/file/d/<id>/...
  if (host === 'drive.google.com') {
    const parts = url.pathname.split('/').filter(Boolean);
    const dIdx = parts.indexOf('d');
    const id = dIdx !== -1 ? parts[dIdx + 1] : null;
    return id ? { provider: 'gdrive', external_id: id } : null;
  }

  return null;
}

module.exports = { parseVideoUrl };
