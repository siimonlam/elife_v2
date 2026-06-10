
CREATE TABLE IF NOT EXISTS seo_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path text NOT NULL,
  lang text NOT NULL CHECK (lang IN ('en', 'de', 'it', 'fr')),
  title text,
  description text,
  keywords text,
  og_image text,
  no_index boolean DEFAULT false,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(page_path, lang)
);

ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

-- Public read (needed so the site can load overrides without auth)
CREATE POLICY "public_read_seo_settings" ON seo_settings
  FOR SELECT TO anon, authenticated USING (true);

-- Only admins can insert/update/delete (checked via profiles)
CREATE POLICY "admin_insert_seo_settings" ON seo_settings
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "admin_update_seo_settings" ON seo_settings
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "admin_delete_seo_settings" ON seo_settings
  FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Trigger to keep updated_at fresh
CREATE OR REPLACE FUNCTION update_seo_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER seo_settings_updated_at
  BEFORE UPDATE ON seo_settings
  FOR EACH ROW EXECUTE FUNCTION update_seo_settings_updated_at();
