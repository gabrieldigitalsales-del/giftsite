import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSiteSettings } from '@/hooks/use-site-settings';

const features = [
  {
    icon: Shield,
    label: 'Confiança',
    desc: 'Atendimento consultivo e suporte técnico para o seu negócio operar com segurança.',
  },
  {
    icon: Award,
    label: 'Excelência',
    desc: 'Equipamentos de alto padrão e compromisso com desempenho, qualidade e durabilidade.',
  },
  {
    icon: Zap,
    label: 'Tecnologia',
    desc: 'Soluções industriais para reduzir esforço manual, padronizar processos e aumentar produtividade.',
  },
];

export default function CompanyIntro() {
  const { settings } = useSiteSettings();
  const [firstParagraph, secondParagraph] = settings.aboutParagraphs;

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">
              Sobre nós
            </span>

            <h2 className="font-heading text-4xl md:text-6xl text-secondary mt-2 mb-6">
              QUEM É A GIFT<br />
              <span className="text-primary">EXCELLENCE</span>
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-4 text-lg">
              {firstParagraph}
            </p>

            <p className="text-muted-foreground leading-relaxed mb-8">
              {secondParagraph || settings.mission}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/sobre">
                <Button
                  variant="outline"
                  className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-semibold"
                >
                  Conheça nossa história
                </Button>
              </Link>

              <Link to="/catalogo">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  Ver catálogo
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid gap-6"
          >
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-5 p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <f.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>

                <div>
                  <h3 className="font-bold text-lg text-secondary mb-1">{f.label}</h3>
                  <p className="text-muted-foreground text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
