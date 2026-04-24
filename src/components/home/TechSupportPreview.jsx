import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wrench, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  "Suporte técnico especializado",
  "Atendimento rápido e eficiente",
  "Profissionais certificados",
  "Manutenção preventiva e corretiva",
];

export default function TechSupportPreview() {
  return (
    <section className="py-20 md:py-28 bg-muted">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <Wrench className="w-8 h-8 text-primary" />
            </div>

            <h2 className="font-heading text-4xl md:text-6xl text-secondary mb-6">
              ASSISTÊNCIA <span className="text-primary">TÉCNICA</span>
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Conte com nosso time de profissionais especializados para manter seus equipamentos sempre em pleno funcionamento. Oferecemos suporte completo com agilidade e competência.
            </p>

            <ul className="space-y-3 mb-8">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <Link to="/assistencia-tecnica">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold group">
                Solicitar Assistência
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="bg-primary text-primary-foreground p-6 rounded-xl shadow-xl w-full max-w-xs">
              <div className="font-heading text-3xl">100%</div>
              <div className="text-sm text-primary-foreground/80">Compromisso com qualidade</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
