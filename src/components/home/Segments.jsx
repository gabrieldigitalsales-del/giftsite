import React from 'react';
import { Factory, Store, Gift, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const segments = [
  { icon: Factory, title: "Indústrias", desc: "Equipamentos robustos para produção industrial em larga escala" },
  { icon: Store, title: "Pequenos Negócios", desc: "Soluções acessíveis e eficientes para empreendedores" },
  { icon: Gift, title: "Brindes e Personalização", desc: "Máquinas para criação de produtos personalizados e únicos" },
  { icon: Package, title: "Embalagens", desc: "Tecnologia de ponta para o segmento de embalagens" },
];

export default function Segments() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Segmentos</span>
          <h2 className="font-heading text-4xl md:text-6xl text-secondary mt-2">
            QUEM <span className="text-primary">ATENDEMOS</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {segments.map((seg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative p-8 rounded-xl bg-card border border-border hover:border-primary/40 text-center hover:shadow-xl transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <seg.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-bold text-lg text-secondary mb-2">{seg.title}</h3>
                <p className="text-muted-foreground text-sm">{seg.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}