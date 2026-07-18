const API_URL = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers: options.body instanceof FormData
      ? options.headers
      : { 'Content-Type': 'application/json', ...options.headers },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `Ошибка запроса (${res.status})`);
  return body;
}

export const adminApi = {
  // content
  listContent: () => request('/api/admin/content'),
  updateContent: (key, value, group) =>
    request(`/api/admin/content/${encodeURIComponent(key)}`, {
      method: 'PUT',
      body: JSON.stringify({ value, group }),
    }),

  // videos
  addVideo: (section, url, title) =>
    request('/api/admin/videos', {
      method: 'POST',
      body: JSON.stringify({ section, url, title }),
    }),
  reorderVideo: (id, direction) =>
    request(`/api/admin/videos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ direction }),
    }),
  renameVideo: (id, title) =>
    request(`/api/admin/videos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ title }),
    }),
  deleteVideo: (id) => request(`/api/admin/videos/${id}`, { method: 'DELETE' }),

  // photos
  uploadPhoto: (section, file, wide) => {
    const formData = new FormData();
    formData.append('section', section);
    formData.append('photo', file);
    if (wide) formData.append('wide', 'true');
    return request('/api/admin/photos', { method: 'POST', body: formData });
  },
  reorderPhoto: (id, direction) =>
    request(`/api/admin/photos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ direction }),
    }),
  toggleWidePhoto: (id, wide) =>
    request(`/api/admin/photos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ wide }),
    }),
  deletePhoto: (id) => request(`/api/admin/photos/${id}`, { method: 'DELETE' }),

  // public reads (no auth needed, but admin dashboard reuses them for listing)
  getContent: () => request('/api/content'),
  getVideos: () => request('/api/videos'),
  getPhotos: () => request('/api/photos'),
};
