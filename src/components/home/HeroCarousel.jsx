import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultSlides = [
  {
    title: 'Excelência em Máquinas Industriais',
    subtitle: 'Tecnologia de ponta para impulsionar seu negócio com qualidade e confiança',
    image_url: ''
  },
  {
    title: 'Soluções para Brindes e Personalização',
    subtitle: 'Equipamentos profissionais para criar produtos únicos e de alto padrão',
    image_url: ''
  },
  {
    title: 'Soluções para Embalagens',
    subtitle: 'Linha completa de máquinas para o segmento de embalagens industriais',
    image_url: ''
  },
  {
    title: 'Assistência Técnica Especializada',
    subtitle: 'Suporte técnico profissional para manter seus equipamentos sempre em operação',
    image_url: ''
  }
];

export default function HeroCarousel({ slides }) {
  const [current, setCurrent] = useState(0);
  const activeSlides = slides && slides.length > 0 ? slides : defaultSlides;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next]);

  const currentSlide = activeSlides[current];
  const hasImage = Boolean(currentSlide?.image_url);

  return (
    <div className="relative h-[85vh] min-h-[600px] overflow-hidden bg-secondary">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {hasImage ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${currentSlide.image_url})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.35),_transparent_30%),linear-gradient(135deg,_#0f0f10_0%,_#1a1a1d_35%,_#2a2a2f_100%)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex items-center">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-block bg-primary/90 px-4 py-1 mb-4">
                <span className="text-white text-xs font-semibold uppercase tracking-widest">Gift Excellence</span>
              </div>
              <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-white leading-none mb-4">
                {currentSlide.title}
              </h1>
              <p className="text-white/80 text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
                {currentSlide.subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/orcamento">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base px-8 py-6 group">
                    Solicitar Orçamento
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/catalogo">
                  <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 font-semibold text-base px-8 py-6">
                    Ver Catálogo
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex gap-2">
            {activeSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === current ? 'w-10 bg-primary' : 'w-4 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={prev} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
