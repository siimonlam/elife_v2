
-- Add footwear category
INSERT INTO categories (name, name_translations, slug, sort_order, description)
VALUES (
  'Footwear',
  '{"en":"Footwear","de":"Schuhe","it":"Calzature","fr":"Chaussures"}',
  'footwear',
  7,
  'Comfortable and stylish shoes for children'
)
ON CONFLICT (slug) DO NOTHING;

-- Insert real product ZS0004
INSERT INTO products (
  name,
  description,
  slug,
  price,
  compare_price,
  sku,
  stock,
  category_id,
  images,
  tags,
  featured,
  is_new,
  is_active,
  age_range,
  brand
)
VALUES (
  '{"en":"Kids Sneakers ZS0004","de":"Kinder-Sneakers ZS0004","it":"Sneakers Bambini ZS0004","fr":"Baskets Enfants ZS0004"}',
  $desc${"en":"<p>Designed for little adventurers, these lightweight sneakers combine comfort and durability for everyday wear. The breathable upper keeps little feet cool and fresh while the flexible sole supports natural movement as children grow. Perfect for playgrounds, school runs, and every adventure in between.</p><ul><li>Breathable mesh upper</li><li>Flexible, non-slip sole</li><li>Easy hook-and-loop fastening</li><li>Cushioned insole for all-day comfort</li><li>Available in multiple colour variants</li></ul>","de":"<p>Diese leichten Sneakers sind für kleine Abenteurer konzipiert und verbinden Komfort mit Langlebigkeit für den täglichen Einsatz. Das atmungsaktive Obermaterial hält kleine Füße kühl und frisch, während die flexible Sohle die natürliche Bewegung unterstützt.</p><ul><li>Atmungsaktives Mesh-Obermaterial</li><li>Flexible, rutschfeste Sohle</li><li>Einfacher Klettverschluss</li><li>Gepolsterte Einlegesohle für ganztägigen Komfort</li><li>In mehreren Farbvarianten erhältlich</li></ul>","it":"<p>Progettate per i piccoli avventurieri, queste sneakers leggere combinano comfort e durata per uso quotidiano. La tomaia traspirante mantiene i piedini freschi mentre la suola flessibile supporta il movimento naturale.</p><ul><li>Tomaia in mesh traspirante</li><li>Suola flessibile e antiscivolo</li><li>Chiusura a strappo facile</li><li>Soletta imbottita per comfort tutto il giorno</li><li>Disponibile in più varianti di colore</li></ul>","fr":"<p>Conçues pour les petits aventuriers, ces baskets légères allient confort et durabilité pour une utilisation quotidienne. La tige respirante garde les petits pieds au frais tandis que la semelle flexible soutient le mouvement naturel.</p><ul><li>Tige en mesh respirant</li><li>Semelle flexible et antidérapante</li><li>Fermeture velcro facile</li><li>Semelle intérieure rembourrée pour un confort toute la journée</li><li>Disponible en plusieurs coloris</li></ul>"}$desc$,
  'kids-sneakers-zs0004',
  49.90,
  64.90,
  'ZS0004',
  50,
  (SELECT id FROM categories WHERE slug = 'footwear'),
  ARRAY[
    '/products/ZS0004-A-16-1NEW.jpg',
    '/products/ZS0004-A-16-_(1).jpg',
    '/products/ZS0004-A-16-_(2).jpg',
    '/products/ZS0004-A-16-_(3).jpg',
    '/products/ZS0004-A-16-_(4).jpg',
    '/products/ZS0004-A-16-_(5).jpg',
    '/products/ZS0004-A-16-_(6).jpg',
    '/products/ZS0004-A-16-_(7).jpg',
    '/products/ZS0004-A-16-_(8).jpg',
    '/products/ZS0004-A-16-_(9).jpg',
    '/products/ZS0004-A+-16-1.jpg',
    '/products/ZS0004-A+-16-2.jpg'
  ],
  ARRAY['shoes', 'sneakers', 'footwear', 'kids', 'comfortable'],
  true,
  true,
  true,
  '2-8 years',
  'Wonderkind'
)
ON CONFLICT (slug) DO NOTHING;
