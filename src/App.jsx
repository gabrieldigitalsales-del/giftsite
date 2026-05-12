import { Toaster } from '@/components/ui/toaster';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

import Layout from '@/components/layout/Layout';
import AdminLayout from '@/components/admin/AdminLayout';

import Home from '@/pages/Home';
import About from '@/pages/About';
import Catalog from '@/pages/Catalog';
import MachineDetail from '@/pages/MachineDetail';
import Services from '@/pages/Services';
import Gallery from '@/pages/Gallery';
import Contact from '@/pages/Contact';
import QuoteRequest from '@/pages/QuoteRequest';
import TechSupport from '@/pages/TechSupport';

import AdminLogin from '@/pages/admin/AdminLogin';
import AdminHome from '@/pages/admin/AdminHome';
import AdminMachines from '@/pages/admin/AdminMachines';
import AdminSlides from '@/pages/admin/AdminSlides';
import AdminGallery from '@/pages/admin/AdminGallery';
import AdminQuotes from '@/pages/admin/AdminQuotes';
import AdminTechSupport from '@/pages/admin/AdminTechSupport';
import AdminServices from '@/pages/admin/AdminServices';
import AdminSettings from '@/pages/admin/AdminSettings';

const UnauthenticatedElement = () => <Navigate to="/admin/login" replace />;

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/catalogo" element={<Catalog />} />
              <Route path="/catalogo/:slug" element={<MachineDetail />} />
              <Route path="/servicos" element={<Services />} />
              <Route path="/galeria" element={<Gallery />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/orcamento" element={<QuoteRequest />} />
              <Route path="/assistencia-tecnica" element={<TechSupport />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />

            <Route element={<ProtectedRoute unauthenticatedElement={<UnauthenticatedElement />} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminHome />} />
                <Route path="maquinas" element={<AdminMachines />} />
                <Route path="slides" element={<AdminSlides />} />
                <Route path="galeria" element={<AdminGallery />} />
                <Route path="orcamentos" element={<AdminQuotes />} />
                <Route path="assistencia" element={<AdminTechSupport />} />
                <Route path="servicos" element={<AdminServices />} />
                <Route path="configuracoes" element={<AdminSettings />} />
              </Route>
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
