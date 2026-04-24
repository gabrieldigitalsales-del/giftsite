import React from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Target, Eye, Heart, Award, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSiteSettings } from '@/hooks/use-site-settings';

const values = [
  { icon: Award, title: 'Excelência', desc: 'Compromisso com a qualidade em tudo que fazemos.' },
  { icon: Users, title: 'Parceria', desc: 'Construímos relações sólidas com clientes, fornecedores e parceiros.' },
  { icon: Zap, title: 'Inovação', desc: 'Buscamos constantemente novas soluções e tecnologias.' },
  { icon: Heart, title: 'Compromisso', desc: 'Dedicação total à satisfação do cliente em cada entrega.' },
];

export default function About() {
  const { settings } = useSiteSettings();

  return (
    <div>
      <PageHeader title="SOBRE A" highlight="GIFT EXCELLENCE" subtitle="Conheça nossa história, valores e compromisso com a excelência" />

      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-primary font-semibold text-sm uppercase tracking-widest">Nossa história</span>
              <h2 className="font-heading text-4xl md:text-5xl text-secondary mt-2 mb-6">
                TRADIÇÃO E <span className="text-primary">INOVAÇÃO</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {settings.aboutParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="grid gap-6"
            >
              <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                  <Award className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-3xl text-secondary mb-3">EXCELÊNCIA</h3>
                <p className="text-muted-foreground leading-relaxed">{settings.mission}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                  <Zap className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-3xl text-secondary mb-3">VISÃO DE FUTURO</h3>
                <p className="text-muted-foreground leading-relaxed">{settings.vision}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-xl p-8 border border-border">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading text-3xl text-secondary mb-4">MISSÃO</h3>
              <p className="text-muted-foreground leading-relaxed">{settings.mission}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-card rounded-xl p-8 border border-border">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                <Eye className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading text-3xl text-secondary mb-4">VISÃO</h3>
              <p className="text-muted-foreground leading-relaxed">{settings.vision}</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">Nossos valores</span>
            <h2 className="font-heading text-4xl md:text-5xl text-secondary mt-2">O QUE NOS <span className="text-primary">MOVE</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all group">
                <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-all">
                  <v.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-bold text-lg text-secondary mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
