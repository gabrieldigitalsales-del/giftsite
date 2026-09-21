import React from 'react';
import PageHeader from '@/components/shared/PageHeader';

export default function Terms() {
  return (
    <div>
      <PageHeader title="TERMOS DE" highlight="USO" />
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4 space-y-6 text-muted-foreground leading-relaxed">
          <p>Este site apresenta informações institucionais, máquinas, serviços e canais de atendimento da GIFT Excellence.</p>
          <p>Solicitações de orçamento e assistência enviadas pelo site não representam contratação automática. Valores, disponibilidade, especificações, prazos e condições comerciais devem ser confirmados diretamente com a equipe GIFT Excellence.</p>
          <p>As imagens, textos, marcas e materiais apresentados destinam-se à comunicação institucional e comercial e não devem ser reproduzidos para fins comerciais sem autorização.</p>
          <p>A consulta de autenticidade depende também da disponibilidade da central externa responsável pela validação dos códigos.</p>
          <p className="text-sm">Atualizado em setembro de 2026.</p>
        </div>
      </section>
    </div>
  );
}
