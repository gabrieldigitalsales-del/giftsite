import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
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

export function useSiteSettings() {
  const query = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => base44.entities.SiteSettings.list('key'),
    staleTime: 30_000,
    initialData: [],
  });

  const settings = useMemo(() => {
    const map = {};
    for (const item of query.data || []) {
      map[item.key] = item.value;
    }

    const whatsappNumber = digitsOnly(map.phone || DEFAULT_WHATSAPP_NUMBER);
    const phone = map.phone || DEFAULT_PHONE;
    const email = map.email || DEFAULT_EMAIL;
    const instagram = map.instagram || DEFAULT_INSTAGRAM;
    const address = map.address || DEFAULT_ADDRESS;
    const hours = map.hours || DEFAULT_HOURS;

    return {
      raw: map,
      phone,
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
