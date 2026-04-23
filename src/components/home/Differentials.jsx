import React from 'react';
import { Award, HeartHandshake, Wrench, Users, BookOpen, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

const items = [
  { icon: Award, title: "Excelência no Atendimento", desc: "Atendimento personalizado e consultivo para cada cliente" },
  { icon: HeartHandshake, title: "Soluções de Qualidade", desc: "Equipamentos certificados e de alto padrão" },
  { icon: LayoutGrid, title: "Equipamentos Profissionais", desc: "Linha completa de máquinas industriais" },
  { icon: Wrench, title: "Assistência Técnica", desc: "Suporte técnico especializado e ágil" },
  { icon: Users, title: "Atendimento Consultivo", desc: "Consultoria técnica para a melhor solução" },
  { icon: BookOpen, title: "Catálogo Completo", desc: "Ampla variedade de máquinas e acessórios" },
];

export default function Differentials() {
  return (
    <section className="py-20 md:py-28 bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Diferenciais</span>
          <h2 className="font-heading text-4xl md:text-6xl mt-2">
            POR QUE ESCOLHER A <span className="text-primary">GIFT EXCELLENCE</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group p-6 rounded-xl border border-secondary-foreground/10 hover:border-primary/40 hover:bg-secondary-foreground/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary transition-all duration-300">
                <item.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-secondary-foreground/60 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}