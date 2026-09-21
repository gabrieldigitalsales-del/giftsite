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
  return {
    ...record,
    created_date: record.created_at,
    updated_date: record.updated_at,
  };
};

const normalizeRecords = (records) => (records || []).map(normalizeRecord);

const applyOrder = (query, orderBy) => {
  if (!orderBy) return query.order('created_at', { ascending: false });

  if (orderBy.startsWith('-')) {
    return query.order(orderBy.slice(1), { ascending: false, nullsFirst: false });
  }

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

      const { error } = await supabase.from(table).insert(payload);
      if (error) throw error;

      return normalizeRecord(payload);
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

export const appClient = {
  entities: {
    Machine: createEntityApi('Machine'),
    HeroSlide: createEntityApi('HeroSlide'),
    GalleryImage: createEntityApi('GalleryImage'),
    Service: createEntityApi('Service'),
    SiteSettings: createEntityApi('SiteSettings'),
    QuoteRequest: createEntityApi('QuoteRequest'),
    TechSupportRequest: createEntityApi('TechSupportRequest'),
    ContactMessage: createEntityApi('ContactMessage'),
  },
  integrations: {
    Core: {
      async UploadFile({ file, folder = 'uploads' }) {
        if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
        const extension = file.name.split('.').pop();
        const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
        const { error: uploadError } = await supabase.storage.from(SUPABASE_STORAGE_BUCKET).upload(filename, file, {
          cacheControl: '3600',
          upsert: false,
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
    async signIn(email, password) {
      if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
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
