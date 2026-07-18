import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Loader from './components/Loader';
import Home from './pages/Home';
import Weddings from './pages/Weddings';
import Corporate from './pages/Corporate';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import { ContentProvider } from './content/ContentContext';
import { AdminAuthProvider } from './admin/AdminAuthContext';

function AppRoutes() {
  const { pathname } = useLocation();
  const [loaded, setLoaded] = useState(false);
  const isHome = pathname === '/';
  const isAdmin = pathname.startsWith('/admin');

  if (isHome && !loaded && !isAdmin) {
    return <Loader onComplete={() => setLoaded(true)} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/weddings" element={<Weddings />} />
      <Route path="/corporate" element={<Corporate />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ContentProvider>
        <AdminAuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AdminAuthProvider>
      </ContentProvider>
    </HelmetProvider>
  );
}
