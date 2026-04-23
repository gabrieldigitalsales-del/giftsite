import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutGrid, Monitor, Image, Wrench, FileText, Settings, MessageSquare, Package, ArrowLeft, Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';

const menuItems = [
  { label: 'Painel', path: '/admin', icon: LayoutGrid },
  { label: 'Máquinas', path: '/admin/maquinas', icon: Package },
  { label: 'Slides / Banner', path: '/admin/slides', icon: Monitor },
  { label: 'Galeria', path: '/admin/galeria', icon: Image },
  { label: 'Serviços', path: '/admin/servicos', icon: Wrench },
  { label: 'Orçamentos', path: '/admin/orcamentos', icon: FileText },
  { label: 'Assistência', path: '/admin/assistencia', icon: MessageSquare },
  { label: 'Configurações', path: '/admin/configuracoes', icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();
  const [sideOpen, setSideOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Você saiu do painel.');
      window.location.href = '/admin/login';
    } catch (error) {
      toast.error(error.message || 'Não foi possível sair.');
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Top bar */}
      <div className="bg-secondary text-secondary-foreground h-14 flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => setSideOpen(!sideOpen)} className="lg:hidden">
            {sideOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-heading text-xl tracking-wide">GIFT <span className="text-primary">EXCELLENCE</span></span>
          <span className="text-secondary-foreground/50 text-sm hidden sm:inline">| Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-secondary-foreground/60 hover:text-secondary-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" /> Ver site
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="text-secondary-foreground/60 hover:text-secondary-foreground" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>
      </div>

      <div className="flex pt-14">
        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-60 bg-card border-r border-border overflow-y-auto transition-transform lg:translate-x-0 ${sideOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <nav className="p-3 space-y-0.5">
            {menuItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSideOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {sideOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSideOpen(false)} />}

        <main className="flex-1 p-4 lg:p-8 min-h-[calc(100vh-3.5rem)] w-full">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}