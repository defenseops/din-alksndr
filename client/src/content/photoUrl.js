const API_URL = import.meta.env.VITE_API_URL || '';

// Фото, загруженные через админку, отдаёт сервер по /uploads/* — в деве это другой
// origin, чем клиент, поэтому им нужен префикс. Старые фото из client/public остаются
// собственными путями клиента (например /gallery/...) и префикс им не нужен.
export function resolvePhotoUrl(src) {
  return src.startsWith('/uploads/') ? `${API_URL}${src}` : src;
}
