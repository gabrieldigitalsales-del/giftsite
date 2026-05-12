import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Monitor, Image, Wrench, FileText, Settings, MessageSquare, Package, ArrowLeft, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

export default function AdminDashboard() {
  const location = useLocation();
  const [sideOpen, setSideOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted pt-0">
      {/* Top bar */}
      <div className="bg-secondary text-secondary-foreground h-14 flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => setSideOpen(!sideOpen)} className="lg:hidden">
            {sideOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-heading text-xl tracking-wide">GIFT <span className="text-primary">EXCELLENCE</span></span>
          <span className="text-secondary-foreground/50 text-sm hidden sm:inline">| Painel Administrativo</span>
        </div>
        <Link to="/">
          <Button variant="ghost" size="sm" className="text-secondary-foreground/60 hover:text-secondary-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Ver site
          </Button>
        </Link>
      </div>

      <div className="flex pt-14">
        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-64 bg-card border-r border-border transition-transform lg:translate-x-0 ${sideOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <nav className="p-4 space-y-1">
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

        {/* Overlay */}
        {sideOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSideOpen(false)} />}

        {/* Content */}
        <main className="flex-1 p-6 lg:p-8 min-h-[calc(100vh-3.5rem)]">
          <div className="max-w-6xl mx-auto">
            <h1 className="font-heading text-3xl text-secondary mb-2">BEM-VINDO AO <span className="text-primary">PAINEL</span></h1>
            <p className="text-muted-foreground mb-8">Gerencie todo o conteúdo do seu site em um só lugar.</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.filter(m => m.path !== '/admin').map(item => (
                <Link key={item.path} to={item.path} className="group p-6 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-all">
                    <item.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-bold text-secondary">{item.label}</h3>
                  <p className="text-muted-foreground text-sm mt-1">Gerenciar {item.label.toLowerCase()}</p>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}