import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Users, Wrench, Headphones, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import CTASection from '@/components/home/CTASection';
import { appClient } from '@/api/appClient';

const iconMap = {
  shoppingcart: ShoppingCart,
  users: Users,
  wrench: Wrench,
  headphones: Headphones,
};

const fallbackServices = [
  {
    title: 'Comercialização de Máquinas',
    description: 'Oferecemos um catálogo completo de máquinas industriais com suporte técnico especializado e foco em produtividade.',
    icon: 'shoppingcart',
    link: '/catalogo',
  },
  {
    title: 'Atendimento Consultivo',
    description: 'Entendemos a necessidade do seu negócio para indicar a melhor solução com atendimento próximo e personalizado.',
    icon: 'users',
    link: '/contato',
  },
  {
    title: 'Assistência Técnica',
    description: 'Contamos com profissionais especializados para manutenção preventiva e corretiva dos seus equipamentos.',
    icon: 'wrench',
    link: '/assistencia-tecnica',
  },
  {
    title: 'Suporte ao Cliente',
    description: 'Disponibilizamos canais de atendimento direto para tirar dúvidas e garantir a melhor experiência possível.',
    icon: 'headphones',
    link: '/contato',
  },
];

export default function Services() {
  const { data } = useQuery({
    queryKey: ['services'],
    queryFn: () => appClient.entities.Service.list('order'),
    initialData: [],
  });

  const services = (data || []).filter((item) => item.active !== false);
  const cards = services.length > 0 ? services.map((service) => ({
    ...service,
    link: service.link || '/contato',
  })) : fallbackServices;

  return (
    <div>
      <PageHeader title="NOSSOS" highlight="SERVIÇOS" subtitle="Soluções completas em máquinas industriais e atendimento especializado" />

      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {cards.map((s, i) => {
              const Icon = iconMap[String(s.icon || '').toLowerCase()] || Wrench;
              return (
                <motion.div
                  key={s.id || i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-8 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-all">
                    <Icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-heading text-2xl text-secondary mb-3">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{s.description}</p>
                  <Link to={s.link}>
                    <Button variant="outline" className="group/btn">
                      Saiba mais <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
