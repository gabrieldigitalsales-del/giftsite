import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getWhatsAppLink } from '@/lib/constants';

export default function MachineDetail() {
  const { slug } = useParams();
  const [activeImage, setActiveImage] = useState(0);

  const { data: machines } = useQuery({
    queryKey: ['machines'],
    queryFn: () => base44.entities.Machine.list('order'),
    initialData: [],
  });

  const machine = machines.find(m => m.slug === slug || m.id === slug);
  const related = machines.filter(m => m.id !== machine?.id && m.active !== false).slice(0, 3);

  if (!machine) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h2 className="font-heading text-3xl text-secondary">Máquina não encontrada</h2>
        <Link to="/catalogo" className="text-primary hover:underline mt-4 inline-block">Voltar ao catálogo</Link>
      </div>
    );
  }

  const images = machine.images?.length > 0 ? machine.images : ["/logo-gift.jpeg"];

  const specs = [
    { label: "Sistemática", value: machine.sistematica },
    { label: "Técnica", value: machine.tecnica },
    { label: "Medidas", value: machine.medidas },
    { label: "Rendimento", value: machine.rendimento },
  ].filter(s => s.value);

  return (
    <div className="pt-24 md:pt-32 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/catalogo" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Catálogo
          </Link>
          <span>/</span>
          <span className="text-foreground">{machine.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="relative aspect-square rounded-xl overflow-hidden bg-muted mb-4">
              <img src={images[activeImage]} alt={machine.name} className="w-full h-full object-cover" />
              {images.length > 1 && (
                <>
                  <button onClick={() => setActiveImage(p => (p - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={() => setActiveImage(p => (p + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      i === activeImage ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            {machine.category && (
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
                {machine.category.replace(/_/g, ' ')}
              </Badge>
            )}
            <h1 className="font-heading text-4xl md:text-5xl text-secondary mb-4">{machine.name}</h1>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold text-primary">Sob consulta</span>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">{machine.description || machine.short_description}</p>

            {/* Specs */}
            {specs.length > 0 && (
              <div className="space-y-4 mb-8">
                {specs.map((s, i) => (
                  <div key={i} className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold text-sm text-primary uppercase tracking-wider mb-1">{s.label}</h4>
                    <p className="text-foreground text-sm whitespace-pre-wrap">{s.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Applications & Benefits */}
            {machine.applications && (
              <div className="mb-6">
                <h4 className="font-bold text-secondary mb-2">Aplicações</h4>
                <p className="text-muted-foreground text-sm whitespace-pre-wrap">{machine.applications}</p>
              </div>
            )}
            {machine.benefits && (
              <div className="mb-8">
                <h4 className="font-bold text-secondary mb-2">Benefícios</h4>
                <p className="text-muted-foreground text-sm whitespace-pre-wrap">{machine.benefits}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/orcamento" className="flex-1">
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold group">
                  Solicitar Orçamento
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href={getWhatsAppLink(`Olá! Tenho interesse na máquina: ${machine.name}`)} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button size="lg" variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50 font-bold">
                  <MessageCircle className="mr-2 w-5 h-5" /> Falar no WhatsApp
                </Button>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Related machines */}
        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-border">
            <h2 className="font-heading text-3xl text-secondary mb-8">MÁQUINAS <span className="text-primary">RELACIONADAS</span></h2>
            <div className="grid md:grid-cols-3 gap-8">
              {related.map(m => (
                <Link key={m.id} to={`/catalogo/${m.slug || m.id}`} className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={m.images?.[0] || "/logo-gift.jpeg"} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-secondary group-hover:text-primary transition-colors">{m.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-1">{m.short_description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}