import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const cats = [
  { value: 'all', label: 'Todas' },
  { value: 'maquinas', label: 'Máquinas' },
  { value: 'aplicacoes', label: 'Aplicações' },
  { value: 'estrutura', label: 'Estrutura' },
  { value: 'projetos', label: 'Projetos' },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  const { data: images } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => base44.entities.GalleryImage.list('order'),
    initialData: [],
  });

  const filtered = images
    .filter(img => img.active !== false)
    .filter(img => activeCategory === 'all' || img.category === activeCategory);

  return (
    <div>
      <PageHeader title="GALERIA" highlight="DE IMAGENS" subtitle="Conheça nossos equipamentos, projetos e estrutura" />

      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {cats.map(c => (
              <Button
                key={c.value}
                variant={activeCategory === c.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(c.value)}
                className={activeCategory === c.value ? 'bg-primary text-primary-foreground' : ''}
              >
                {c.label}
              </Button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Nenhuma imagem encontrada nesta categoria</p>
              <p className="text-muted-foreground text-sm mt-2">As imagens serão adicionadas em breve</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((img, i) => (
                <motion.button
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setLightbox(img)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl"
                >
                  <img src={img.image_url} alt={img.title || 'Galeria'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-start p-4">
                    {img.title && (
                      <span className="text-white font-semibold text-sm opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                        {img.title}
                      </span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-4 right-4 text-white/70 hover:text-white" onClick={() => setLightbox(null)}>
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={lightbox.image_url}
              alt={lightbox.title || ''}
              className="max-w-full max-h-[85vh] rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}