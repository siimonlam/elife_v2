-- Rename all tables to *_elife suffix
ALTER TABLE profiles RENAME TO profiles_elife;
ALTER TABLE categories RENAME TO categories_elife;
ALTER TABLE products RENAME TO products_elife;
ALTER TABLE addresses RENAME TO addresses_elife;
ALTER TABLE orders RENAME TO orders_elife;
ALTER TABLE order_items RENAME TO order_items_elife;
ALTER TABLE blog_posts RENAME TO blog_posts_elife;
ALTER TABLE contacts RENAME TO contacts_elife;
ALTER TABLE seo_settings RENAME TO seo_settings_elife;

-- Rename the seo_settings trigger to match new table name
ALTER TRIGGER seo_settings_updated_at ON seo_settings_elife RENAME TO seo_settings_elife_updated_at;
