import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  PHONE as DEFAULT_PHONE,
  EMAIL as DEFAULT_EMAIL,
  INSTAGRAM as DEFAULT_INSTAGRAM,
  ADDRESS as DEFAULT_ADDRESS,
  HOURS as DEFAULT_HOURS,
  WHATSAPP_NUMBER as DEFAULT_WHATSAPP_NUMBER,
} from '@/lib/constants';

const DEFAULT_ABOUT_TEXT = 'A Gift Excellence é uma empresa especializada em soluções industriais para os segmentos de brindes, personalização e embalagens, com foco em qualidade, produtividade e atendimento consultivo.';
const DEFAULT_MISSION = 'Nossa missão é desenvolver soluções industriais que entreguem produtividade, segurança e qualidade para nossos clientes.';
const DEFAULT_VISION = 'Nossa visão é ser referência em tecnologia industrial, reconhecida pela inovação, durabilidade e alto desempenho das nossas máquinas.';

const toInstagramHandle = (url) => {
  if (!url) return '@giftexcellence_ofc';
  try {
    const clean = String(url).replace(/\/$/, '');
    const handle = clean.split('/').filter(Boolean).pop();
    return handle ? `@${handle}` : '@giftexcellence_ofc';
  } catch {
    return '@giftexcellence_ofc';
  }
};

const digitsOnly = (value = '') => String(value).replace(/\D/g, '');

async function fetchSiteSettings() {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase
    .from('gift_site_settings')
    .select('key, value')
    .order('key', { ascending: true });

  if (error) {
    console.error('Erro ao carregar gift_site_settings:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

function splitParagraphs(text, fallback) {
  return String(text || fallback)
    .split(/\n\s*\n|\r\n\s*\r\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function useSiteSettings() {
  const query = useQuery({
    queryKey: ['siteSettings'],
    queryFn: fetchSiteSettings,
    initialData: [],
    staleTime: 0,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchInterval: isSupabaseConfigured ? 5000 : false,
    retry: 1,
  });

  const settings = useMemo(() => {
    const map = {};
    for (const item of query.data || []) {
      if (item?.key) map[item.key] = item.value;
    }

    const phone = map.phone || DEFAULT_PHONE;
    const whatsappNumber = digitsOnly(map.phone || DEFAULT_WHATSAPP_NUMBER);
    const email = map.email || DEFAULT_EMAIL;
    const instagram = map.instagram || DEFAULT_INSTAGRAM;
    const address = map.address || DEFAULT_ADDRESS;
    const hours = map.hours || DEFAULT_HOURS;
    const aboutText = map.about_text || DEFAULT_ABOUT_TEXT;
    const mission = map.mission || DEFAULT_MISSION;
    const vision = map.vision || DEFAULT_VISION;

    return {
      raw: map,
      phone,
      telLink: `tel:${digitsOnly(phone)}`,
      email,
      instagram,
      instagramHandle: toInstagramHandle(instagram),
      address,
      hours,
      whatsappNumber,
      whatsappLink: `https://wa.me/${whatsappNumber}`,
      aboutText,
      aboutParagraphs: splitParagraphs(aboutText, DEFAULT_ABOUT_TEXT),
      mission,
      vision,
      getWhatsAppLink(message = '') {
        const encoded = encodeURIComponent(message);
        return `https://wa.me/${whatsappNumber}${message ? `?text=${encoded}` : ''}`;
      },
    };
  }, [query.data]);

  return { ...query, settings };
}
