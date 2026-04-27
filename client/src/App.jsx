import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Loader from './components/Loader';
import Home from './pages/Home';
import Weddings from './pages/Weddings';
import Corporate from './pages/Corporate';

function AppRoutes() {
  const { pathname } = useLocation();
  const [loaded, setLoaded] = useState(false);
  const isHome = pathname === '/';

  if (isHome && !loaded) {
    return <Loader onComplete={() => setLoaded(true)} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/weddings" element={<Weddings />} />
      <Route path="/corporate" element={<Corporate />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </HelmetProvider>
  );
}
