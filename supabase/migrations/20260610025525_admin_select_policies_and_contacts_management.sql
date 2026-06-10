-- Admin needs to see ALL products (including inactive ones)
CREATE POLICY "admin_select_all_products" ON products_elife
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles_elife
    WHERE id = auth.uid() AND is_admin = true
  ));

-- Admin needs to see ALL blog posts (including unpublished drafts)
CREATE POLICY "admin_select_all_blog_posts" ON blog_posts_elife
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles_elife
    WHERE id = auth.uid() AND is_admin = true
  ));

-- Admin needs to update contacts (mark as read, etc.)
CREATE POLICY "admin_update_contacts" ON contacts_elife
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles_elife
    WHERE id = auth.uid() AND is_admin = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles_elife
    WHERE id = auth.uid() AND is_admin = true
  ));

-- Admin needs to delete contacts
CREATE POLICY "admin_delete_contacts" ON contacts_elife
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles_elife
    WHERE id = auth.uid() AND is_admin = true
  ));
