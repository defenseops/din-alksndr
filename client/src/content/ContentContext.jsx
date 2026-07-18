import { useEffect, useState } from 'react';
import { ContentCtx } from './context';

const API_URL = import.meta.env.VITE_API_URL || '';

export function ContentProvider({ children }) {
  const [state, setState] = useState({ content: {}, videos: {}, photos: {}, loaded: false });

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/content`).then((r) => r.json()).catch(() => ({})),
      fetch(`${API_URL}/api/videos`).then((r) => r.json()).catch(() => ({})),
      fetch(`${API_URL}/api/photos`).then((r) => r.json()).catch(() => ({})),
    ]).then(([content, videos, photos]) => {
      setState({ content, videos, photos, loaded: true });
    });
  }, []);

  return <ContentCtx.Provider value={state}>{children}</ContentCtx.Provider>;
}
