
CREATE POLICY "admin_select_all_order_items" ON order_items_elife FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles_elife
    WHERE profiles_elife.id = auth.uid() AND profiles_elife.is_admin = true
  ));
