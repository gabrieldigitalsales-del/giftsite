import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteSettings } from '@/hooks/use-site-settings';

const navLinks = [
  { label: 'Início', path: '/' },
  { label: 'Sobre', path: '/sobre' },
  { label: 'Catálogo', path: '/catalogo' },
  { label: 'Serviços', path: '/servicos' },
  { label: 'Assistência Técnica', path: '/assistencia-tecnica' },
  { label: 'Galeria', path: '/galeria' },
  { label: 'Contato', path: '/contato' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { settings } = useSiteSettings();

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="bg-secondary text-secondary-foreground hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <a href={settings.telLink} className="flex items-center gap-1 hover:text-primary transition-colors">
              <Phone className="w-3 h-3" /> {settings.phone}
            </a>
          </div>
          <a href={settings.whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-medium">
            Atendimento via WhatsApp
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div>
            <p className="font-heading text-3xl leading-none text-secondary">GIFT</p>
            <p className="font-heading text-2xl leading-none text-primary -mt-1">EXCELLENCE</p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium uppercase tracking-wide transition-colors ${isActive ? 'text-primary' : 'text-secondary hover:text-primary'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link to="/orcamento">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6">
              Solicitar Orçamento
            </Button>
          </Link>
        </div>

        <button className="lg:hidden text-secondary" onClick={() => setMobileOpen((v) => !v)} aria-label="Abrir menu">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-background"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `text-sm font-medium uppercase tracking-wide transition-colors ${isActive ? 'text-primary' : 'text-secondary hover:text-primary'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link to="/orcamento" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  Solicitar Orçamento
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
