import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Lang } from '../types';

export interface SEORecord {
  id: string;
  page_path: string;
  lang: Lang;
  title: string | null;
  description: string | null;
  keywords: string | null;
  og_image: string | null;
  no_index: boolean;
  updated_at: string;
}

interface SEOContextValue {
  overrides: Map<string, SEORecord>;
  refresh: () => Promise<void>;
}

const SEOContext = createContext<SEOContextValue>({
  overrides: new Map(),
  refresh: async () => {},
});

export function SEOProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<Map<string, SEORecord>>(new Map());

  const refresh = async () => {
    const { data } = await supabase.from('seo_settings_elife').select('*');
    if (data) {
      const map = new Map<string, SEORecord>();
      data.forEach(row => map.set(`${row.page_path}__${row.lang}`, row as SEORecord));
      setOverrides(map);
    }
  };

  useEffect(() => { refresh(); }, []);

  return (
    <SEOContext.Provider value={{ overrides, refresh }}>
      {children}
    </SEOContext.Provider>
  );
}

export function useSEOContext() {
  return useContext(SEOContext);
}

export function useSEOOverride(pagePath: string, lang: Lang): SEORecord | undefined {
  const { overrides } = useSEOContext();
  return overrides.get(`${pagePath}__${lang}`);
}
