import { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
    const clean = url.replace(/\/$/, '');
    const handle = clean.split('/').filter(Boolean).pop();
    return handle ? `@${handle}` : '@giftexcellence_ofc';
  } catch {
    return '@giftexcellence_ofc';
  }
};

const digitsOnly = (value = '') => value.replace(/\D/g, '');

async function fetchSiteSettings() {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('gift_site_settings')
    .select('key, value, updated_at')
    .order('key', { ascending: true });

  if (error) throw error;
  return data || [];
}

function splitParagraphs(text, fallback) {
  return (text || fallback)
    .split(/\n\s*\n|\r\n\s*\r\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function useSiteSettings() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['siteSettings'],
    queryFn: fetchSiteSettings,
    initialData: [],
    staleTime: 0,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    const channel = supabase
      .channel('gift-site-settings-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gift_site_settings' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const settings = useMemo(() => {
    const map = {};
    for (const item of query.data || []) {
      map[item.key] = item.value;
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
