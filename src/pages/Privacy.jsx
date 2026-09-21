import React from 'react';
import PageHeader from '@/components/shared/PageHeader';

export default function Privacy() {
  return (
    <div>
      <PageHeader title="POLÍTICA DE" highlight="PRIVACIDADE" />
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4 space-y-6 text-muted-foreground leading-relaxed">
          <p>A GIFT Excellence respeita a privacidade de clientes, visitantes e parceiros. Os dados enviados voluntariamente pelo site são utilizados para atendimento comercial, elaboração de orçamentos, assistência técnica e resposta a solicitações.</p>
          <p>Os formulários podem solicitar nome, empresa, telefone, e-mail, cidade, equipamento de interesse e descrição da necessidade. Essas informações são armazenadas em infraestrutura protegida e acessíveis somente a usuários administrativos autorizados do site.</p>
          <p>O site também pode utilizar recursos técnicos de segurança, como limitação de envios por endereço de rede, para reduzir spam e uso abusivo.</p>
          <p>Ao utilizar links externos, como WhatsApp, Instagram ou mapas, o visitante também estará sujeito às políticas das respectivas plataformas.</p>
          <p className="text-sm">Atualizado em setembro de 2026.</p>
        </div>
      </section>
    </div>
  );
}
