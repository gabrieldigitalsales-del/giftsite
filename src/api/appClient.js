import { supabase, SUPABASE_STORAGE_BUCKET, isSupabaseConfigured } from '@/lib/supabase';

const tableMap = {
  Machine: 'gift_machines',
  HeroSlide: 'gift_hero_slides',
  GalleryImage: 'gift_gallery_images',
  Service: 'gift_services',
  SiteSettings: 'gift_site_settings',
  QuoteRequest: 'gift_quote_requests',
  TechSupportRequest: 'gift_tech_support_requests',
  ContactMessage: 'gift_contact_messages',
};

const normalizeRecord = (record) => {
  if (!record) return record;
  return { ...record, created_date: record.created_at, updated_date: record.updated_at };
};
const normalizeRecords = (records) => (records || []).map(normalizeRecord);

const applyOrder = (query, orderBy) => {
  if (!orderBy) return query.order('created_at', { ascending: false });
  if (orderBy.startsWith('-')) return query.order(orderBy.slice(1), { ascending: false, nullsFirst: false });
  return query.order(orderBy, { ascending: true, nullsFirst: false });
};

const createEntityApi = (entityName) => {
  const table = tableMap[entityName];
  return {
    async list(orderBy) {
      if (!isSupabaseConfigured) return [];
      let query = supabase.from(table).select('*');
      query = applyOrder(query, orderBy);
      const { data, error } = await query;
      if (error) throw error;
      return normalizeRecords(data);
    },
    async create(payload) {
      if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
      const { data, error } = await supabase.from(table).insert(payload).select().maybeSingle();
      if (error) throw error;
      return normalizeRecord(data || payload);
    },
    async update(id, payload) {
      if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
      const { data, error } = await supabase.from(table).update(payload).eq('id', id).select().single();
      if (error) throw error;
      return normalizeRecord(data);
    },
    async delete(id) {
      if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    },
  };
};

async function optimizeImage(file) {
  if (!file || !String(file.type || '').startsWith('image/')) return file;
  if (file.type === 'image/webp' && file.size <= 1400000) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const max = 2000;
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.84));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], String(file.name || 'imagem').replace(/\.[^.]+$/, '') + '.webp', {
      type: 'image/webp',
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}

export const appClient = {
  entities: Object.fromEntries(Object.keys(tableMap).map((name) => [name, createEntityApi(name)])),
  integrations: {
    Core: {
      async UploadFile({ file, folder = 'uploads' }) {
        if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
        const optimized = await optimizeImage(file);
        const extension = (optimized.name.split('.').pop() || 'webp').toLowerCase();
        const filename = `${folder}/${Date.now()}-${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}.${extension}`;
        const { error: uploadError } = await supabase.storage.from(SUPABASE_STORAGE_BUCKET).upload(filename, optimized, {
          cacheControl: '31536000',
          upsert: false,
          contentType: optimized.type || undefined,
        });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from(SUPABASE_STORAGE_BUCKET).getPublicUrl(filename);
        return { file_url: data.publicUrl, path: filename };
      },
    },
  },
  auth: {
    async me() {
      if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!data?.user) throw new Error('Not authenticated');
      return data.user;
    },
    async isGiftAdmin(userId) {
      if (!userId || !isSupabaseConfigured) return false;
      const { data, error } = await supabase.from('gift_site_admins').select('user_id').eq('user_id', userId).maybeSingle();
      if (error) throw error;
      return Boolean(data?.user_id);
    },
    async signIn(email, password) {
      if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const allowed = await this.isGiftAdmin(data.user?.id);
      if (!allowed) {
        await supabase.auth.signOut();
        throw new Error('Este usuário não possui permissão administrativa para o site.');
      }
      return data;
    },
    async logout() {
      if (!isSupabaseConfigured) return true;
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    },
  },
};
