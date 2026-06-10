
/*
# Elife — Products Page Database
Optimises the products catalogue for the Products listing page:
- Full-text search index on product name (English) for the search bar
- Composite indexes for the common filter + sort combinations
- Index on is_new and featured for quick-filter buttons
- Index on price for price-ascending / descending sort
- Index on tags GIN for tag-based filtering
- Ensures the footwear category exists (used by real products)
*/

-- Full-text search index on product name (en field extracted from JSONB)
CREATE INDEX IF NOT EXISTS products_name_en_search_idx
  ON products USING gin(to_tsvector('english', (name->>'en')));

-- Index for the default "newest" sort (is_active + created_at)
CREATE INDEX IF NOT EXISTS products_active_created_idx
  ON products(is_active, created_at DESC);

-- Index for price-based sorts
CREATE INDEX IF NOT EXISTS products_price_idx
  ON products(price);

-- Index for "New Arrivals" quick filter
CREATE INDEX IF NOT EXISTS products_is_new_idx
  ON products(is_new) WHERE is_new = true;

-- Index for "Featured" quick filter
CREATE INDEX IF NOT EXISTS products_featured_active_idx
  ON products(featured, is_active) WHERE featured = true AND is_active = true;

-- GIN index on tags array for tag filtering
CREATE INDEX IF NOT EXISTS products_tags_gin_idx
  ON products USING gin(tags);

-- Composite index: category + active + created (category page default sort)
CREATE INDEX IF NOT EXISTS products_category_active_created_idx
  ON products(category_id, is_active, created_at DESC);

-- Ensure footwear category row exists (for ZS0004 and future shoe products)
INSERT INTO categories (name, name_translations, slug, sort_order, description)
VALUES (
  'Footwear',
  '{"en":"Footwear","de":"Schuhe","it":"Calzature","fr":"Chaussures"}',
  'footwear',
  7,
  'Comfortable and stylish shoes for children'
)
ON CONFLICT (slug) DO NOTHING;
