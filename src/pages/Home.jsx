import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { appClient } from '@/api/appClient';
import HeroCarousel from '@/components/home/HeroCarousel';
import CompanyIntro from '@/components/home/CompanyIntro';
import FeaturedMachines from '@/components/home/FeaturedMachines';
import Segments from '@/components/home/Segments';
import Differentials from '@/components/home/Differentials';
import CTASection from '@/components/home/CTASection';
import TechSupportPreview from '@/components/home/TechSupportPreview';
import QuickContact from '@/components/home/QuickContact';

export default function Home() {
  const { data: slides } = useQuery({
    queryKey: ['heroSlides'],
    queryFn: () => appClient.entities.HeroSlide.list('order'),
    initialData: [],
  });

  const { data: machines } = useQuery({
    queryKey: ['machines'],
    queryFn: () => appClient.entities.Machine.list('order'),
    initialData: [],
  });

  const activeSlides = slides.filter(s => s.active);

  return (
    <div>
      <HeroCarousel slides={activeSlides} />
      <CompanyIntro />
      <FeaturedMachines machines={machines} />
      <Segments />
      <Differentials />
      <CTASection />
      <TechSupportPreview />
      <QuickContact />
    </div>
  );
}