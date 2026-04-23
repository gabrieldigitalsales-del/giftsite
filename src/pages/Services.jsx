import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Users, Wrench, Headphones, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import CTASection from '@/components/home/CTASection';

const services = [
  {
    icon: ShoppingCart,
    title: "Comercialização de Máquinas",
    desc: "Oferecemos um catálogo completo de máquinas industriais para os mais diversos segmentos. Equipamentos de alta qualidade, com garantia e suporte técnico especializado.",
    link: "/catalogo"
  },
  {
    icon: Users,
    title: "Atendimento Consultivo",
    desc: "Nossa equipe realiza um atendimento consultivo personalizado, entendendo as necessidades do seu negócio para indicar a solução ideal. Cada cliente recebe atenção exclusiva.",
    link: "/contato"
  },
  {
    icon: Wrench,
    title: "Assistência Técnica",
    desc: "Contamos com profissionais especializados para manutenção preventiva e corretiva dos seus equipamentos. Garantimos agilidade e eficiência no suporte técnico.",
    link: "/assistencia-tecnica"
  },
  {
    icon: Headphones,
    title: "Suporte ao Cliente",
    desc: "Disponibilizamos canais de atendimento direto para tirar dúvidas, receber feedback e garantir a melhor experiência possível com nossos produtos e serviços.",
    link: "/contato"
  },
];

export default function Services() {
  return (
    <div>
      <PageHeader title="NOSSOS" highlight="SERVIÇOS" subtitle="Soluções completas em máquinas industriais e atendimento especializado" />

      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-2xl transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-all">
                  <s.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-heading text-2xl text-secondary mb-3">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{s.desc}</p>
                <Link to={s.link}>
                  <Button variant="outline" className="group/btn">
                    Saiba mais <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}