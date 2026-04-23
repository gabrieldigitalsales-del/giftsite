import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { getWhatsAppLink } from '@/lib/constants';

export default function FeaturedMachines({ machines }) {
  const featured = machines?.filter(m => m.featured && m.active)?.slice(0, 6) || [];

  if (featured.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-muted">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Catálogo</span>
          <h2 className="font-heading text-4xl md:text-6xl text-secondary mt-2">
            MÁQUINAS EM <span className="text-primary">DESTAQUE</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Conheça nossos equipamentos profissionais de alto desempenho
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((machine, i) => (
            <motion.div
              key={machine.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={machine.images?.[0] || "/logo-gift.jpeg"}
                  alt={machine.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Link to={`/catalogo/${machine.slug || machine.id}`}>
                    <Button size="sm" variant="secondary" className="w-full font-semibold">
                      <Eye className="w-4 h-4 mr-2" /> Ver detalhes
                    </Button>
                  </Link>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    Sob consulta
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-secondary mb-2 group-hover:text-primary transition-colors">
                  {machine.name}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                  {machine.short_description || "Equipamento profissional de alto desempenho"}
                </p>
                <div className="flex gap-2">
                  <Link to="/orcamento" className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold">
                      Solicitar orçamento
                    </Button>
                  </Link>
                  <a href={getWhatsAppLink(`Olá! Tenho interesse na máquina: ${machine.name}`)} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="border-green-500 text-green-600 hover:bg-green-50">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.34 0-4.508-.752-6.268-2.03l-.438-.33-3.088 1.035 1.035-3.088-.33-.438A9.953 9.953 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/catalogo">
            <Button size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-bold group">
              Ver catálogo completo
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}