import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Search, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getWhatsAppLink } from '@/lib/constants';

const categories = [
  { value: 'all', label: 'Todas' },
  { value: 'brindes', label: 'Brindes' },
  { value: 'embalagens', label: 'Embalagens' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'personalizacao', label: 'Personalização' },
  { value: 'outro', label: 'Outros' },
];

export default function Catalog() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const { data: machines, isLoading } = useQuery({
    queryKey: ['machines'],
    queryFn: () => base44.entities.Machine.list('order'),
    initialData: [],
  });

  const filtered = machines
    .filter(m => m.active !== false)
    .filter(m => activeCategory === 'all' || m.category === activeCategory)
    .filter(m => !search || m.name?.toLowerCase().includes(search.toLowerCase()) || m.short_description?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <PageHeader title="CATÁLOGO DE" highlight="MÁQUINAS" subtitle="Conheça nossa linha completa de equipamentos profissionais" />

      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar máquinas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
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
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-card rounded-xl border border-border animate-pulse">
                  <div className="aspect-[4/3] bg-muted rounded-t-xl" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-10 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Nenhuma máquina encontrada</p>
              <p className="text-muted-foreground text-sm mt-2">Tente alterar os filtros ou entre em contato para mais informações</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((machine, i) => (
                <motion.div
                  key={machine.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={machine.images?.[0] || "/logo-gift.jpeg"}
                      alt={machine.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">Sob consulta</span>
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
                      <Link to={`/catalogo/${machine.slug || machine.id}`} className="flex-1">
                        <Button variant="outline" className="w-full text-sm font-semibold">
                          <Eye className="w-4 h-4 mr-2" /> Ver detalhes
                        </Button>
                      </Link>
                      <Link to="/orcamento" className="flex-1">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold">
                          Orçamento
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}