import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
  PHONE as DEFAULT_PHONE,
  EMAIL as DEFAULT_EMAIL,
  INSTAGRAM as DEFAULT_INSTAGRAM,
  ADDRESS as DEFAULT_ADDRESS,
  HOURS as DEFAULT_HOURS,
  WHATSAPP_NUMBER as DEFAULT_WHATSAPP_NUMBER,
} from '@/lib/constants';

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
  const { data, error } = await supabase
    .from('gift_site_settings')
    .select('key, value, updated_at')
    .order('key', { ascending: true });

  if (error) throw error;
  return data || [];
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
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

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
      getWhatsAppLink(message = '') {
        const encoded = encodeURIComponent(message);
        return `https://wa.me/${whatsappNumber}${message ? `?text=${encoded}` : ''}`;
      },
    };
  }, [query.data]);

  return { ...query, settings };
}
