import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Instagram } from 'lucide-react';
import { useSiteSettings } from '@/hooks/use-site-settings';

const footerLinks = [
  { label: 'Início', path: '/' },
  { label: 'Sobre', path: '/sobre' },
  { label: 'Catálogo', path: '/catalogo' },
  { label: 'Serviços', path: '/servicos' },
  { label: 'Assistência Técnica', path: '/assistencia-tecnica' },
  { label: 'Galeria', path: '/galeria' },
  { label: 'Contato', path: '/contato' },
  { label: 'Orçamento', path: '/orcamento' },
];

export default function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="font-heading text-3xl tracking-wide mb-4">
              GIFT <span className="text-primary">EXCELLENCE</span>
            </h3>
            <p className="text-secondary-foreground/60 text-sm leading-relaxed">
              Excelência em máquinas industriais e soluções para brindes, personalização e embalagens. Qualidade, tecnologia e atendimento de alto nível.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-primary">Navegação</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-primary">Contato</h4>
            <ul className="space-y-3">
              <li>
                <a href={settings.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                  <Phone className="w-4 h-4 flex-shrink-0" /> {settings.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                  <Mail className="w-4 h-4 flex-shrink-0" /> {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-secondary-foreground/60">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" /> {settings.address}
              </li>
              <li className="flex items-start gap-2 text-sm text-secondary-foreground/60">
                <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" /> {settings.hours}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-primary">Redes Sociais</h4>
            <div className="flex items-center gap-3">
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={settings.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
            <div className="mt-6">
              <Link to="/orcamento" className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2.5 rounded-md text-sm transition-colors">
                Solicitar Orçamento
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-secondary-foreground/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-secondary-foreground/40">
          <p>© {new Date().getFullYear()} Gift Excellence. Todos os direitos reservados.</p>
          <p>
            Site criado pela{' '}
            <a href="https://www.instagram.com/nexor_digital_group_/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Nexor Digital Group
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
