
/*
# Wonderkind Seed Data

Populates categories, products, and blog posts with multilingual demo content.
*/

-- Categories
INSERT INTO categories (name, name_translations, slug, image, description, sort_order) VALUES
('Toys & Play', '{"en":"Toys & Play","de":"Spielzeug","it":"Giocattoli","fr":"Jouets & Jeux"}', 'toys-play', 'https://images.pexels.com/photos/3933025/pexels-photo-3933025.jpeg?auto=compress&cs=tinysrgb&w=800', 'Open-ended wooden and sensory toys', 1),
('Clothing', '{"en":"Clothing","de":"Kleidung","it":"Abbigliamento","fr":"Vêtements"}', 'clothing', 'https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg?auto=compress&cs=tinysrgb&w=800', 'Organic cotton garments for little ones', 2),
('Art & Craft', '{"en":"Art & Craft","de":"Kunst & Basteln","it":"Arte e Artigianato","fr":"Art & Artisanat"}', 'art-craft', 'https://images.pexels.com/photos/5063497/pexels-photo-5063497.jpeg?auto=compress&cs=tinysrgb&w=800', 'Natural art supplies and creative tools', 3),
('Books', '{"en":"Books","de":"Bücher","it":"Libri","fr":"Livres"}', 'books', 'https://images.pexels.com/photos/1148399/pexels-photo-1148399.jpeg?auto=compress&cs=tinysrgb&w=800', 'Picture books and children literature', 4),
('Baby & Nursery', '{"en":"Baby & Nursery","de":"Baby & Kinderzimmer","it":"Neonati","fr":"Bébé & Nurserie"}', 'baby-nursery', 'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=800', 'Everything for the newest family member', 5),
('Home & Living', '{"en":"Home & Living","de":"Wohnen & Leben","it":"Casa e Vita","fr":"Maison & Vie"}', 'home-living', 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', 'Thoughtful home objects for families', 6)
ON CONFLICT (slug) DO NOTHING;

-- Products
INSERT INTO products (name, description, slug, price, compare_price, sku, stock, category_id, images, tags, featured, is_new, age_range, brand)
SELECT
  '{"en":"Wooden Rainbow Stacker","de":"Holz-Regenbogen-Stapelturm","it":"Arcobaleno in legno impilabile","fr":"Arc-en-ciel en bois empilable"}'::jsonb,
  '{"en":"A beautiful open-ended rainbow stacker made from sustainably sourced linden wood, finished with water-based non-toxic paints. Encourages colour recognition, fine motor skills and creative play.","de":"Ein wunderschöner Regenbogen-Stapelturm aus nachhaltig gewonnenem Lindenholz.","it":"Un bellissimo arcobaleno impilabile in legno di tiglio da fonti sostenibili.","fr":"Un magnifique arc-en-ciel empilable en bois de tilleul issu de forêts durables."}'::jsonb,
  'wooden-rainbow-stacker', 48.00, 55.00, 'WK-TOY-001', 24,
  c.id,
  ARRAY['https://images.pexels.com/photos/3933025/pexels-photo-3933025.jpeg?auto=compress&cs=tinysrgb&w=800','https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['wooden','rainbow','stacking','open-ended'], true, true, '1+ years', 'Grimm''s'
FROM categories c WHERE c.slug = 'toys-play'
AND NOT EXISTS (SELECT 1 FROM products WHERE slug = 'wooden-rainbow-stacker');

INSERT INTO products (name, description, slug, price, compare_price, sku, stock, category_id, images, tags, featured, is_new, age_range, brand)
SELECT
  '{"en":"Organic Cotton Bodysuit","de":"Bio-Baumwoll-Strampler","it":"Body in cotone biologico","fr":"Body en coton biologique"}'::jsonb,
  '{"en":"Soft organic cotton bodysuit with envelope neckline. GOTS certified, skin-friendly and sustainably made.","de":"Weicher Bio-Baumwoll-Strampler mit Umschlagkragen. GOTS-zertifiziert und hautfreundlich.","it":"Morbido body in cotone biologico con scollatura a busta. Certificato GOTS.","fr":"Body en coton biologique doux avec encolure enveloppe. Certifié GOTS."}'::jsonb,
  'organic-cotton-bodysuit', 32.00, null, 'WK-CLO-001', 40,
  c.id,
  ARRAY['https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['organic','cotton','bodysuit','newborn'], true, false, '0-18 months', 'Organic Zoo'
FROM categories c WHERE c.slug = 'clothing'
AND NOT EXISTS (SELECT 1 FROM products WHERE slug = 'organic-cotton-bodysuit');

INSERT INTO products (name, description, slug, price, compare_price, sku, stock, category_id, images, tags, featured, is_new, age_range, brand)
SELECT
  '{"en":"Natural Beeswax Crayons","de":"Natürliche Bienenwachsstifte","it":"Pastelli in cera d''api","fr":"Crayons en cire d''abeille"}'::jsonb,
  '{"en":"Pure beeswax crayons in 16 vibrant colours. Non-toxic, vegan-friendly, made without synthetic additives.","de":"Reine Bienenwachsstifte in 16 lebendigen Farben. Ungiftig und vegan.","it":"Pastelli puri in cera d''api in 16 colori vivaci. Non tossici e vegani.","fr":"Crayons purs en cire d''abeille en 16 couleurs vives. Non toxiques et végan."}'::jsonb,
  'natural-beeswax-crayons', 18.00, null, 'WK-ART-001', 60,
  c.id,
  ARRAY['https://images.pexels.com/photos/5063497/pexels-photo-5063497.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['crayons','beeswax','art','natural'], false, true, '2+ years', 'Stockmar'
FROM categories c WHERE c.slug = 'art-craft'
AND NOT EXISTS (SELECT 1 FROM products WHERE slug = 'natural-beeswax-crayons');

INSERT INTO products (name, description, slug, price, compare_price, sku, stock, category_id, images, tags, featured, is_new, age_range, brand)
SELECT
  '{"en":"Wobbel Balance Board","de":"Wobbel Balancebrett","it":"Tavola di equilibrio Wobbel","fr":"Planche d''équilibre Wobbel"}'::jsonb,
  '{"en":"The iconic Wobbel balance board made from FSC-certified beech wood. Supports strength, coordination and imaginative play.","de":"Das ikonische Wobbel Balancebrett aus FSC-zertifiziertem Buchenholz.","it":"L''iconico Wobbel in legno di faggio certificato FSC.","fr":"La mythique planche d''équilibre Wobbel en hêtre certifié FSC."}'::jsonb,
  'wobbel-balance-board', 89.00, 109.00, 'WK-TOY-002', 15,
  c.id,
  ARRAY['https://images.pexels.com/photos/3933025/pexels-photo-3933025.jpeg?auto=compress&cs=tinysrgb&w=800','https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['balance','wooden','active','waldorf'], true, false, '1+ years', 'Wobbel'
FROM categories c WHERE c.slug = 'toys-play'
AND NOT EXISTS (SELECT 1 FROM products WHERE slug = 'wobbel-balance-board');

INSERT INTO products (name, description, slug, price, compare_price, sku, stock, category_id, images, tags, featured, is_new, age_range, brand)
SELECT
  '{"en":"Linen Play Tent","de":"Leinen-Spielzelt","it":"Tenda da gioco in lino","fr":"Tente de jeu en lin"}'::jsonb,
  '{"en":"A dreamy linen play tent that sparks imagination. Made from natural linen on a sustainable wooden frame.","de":"Ein traumhaftes Leinen-Spielzelt aus natürlichem Leinen auf Holzgestell.","it":"Una meravigliosa tenda da gioco in lino naturale su struttura in legno.","fr":"Une adorable tente de jeu en lin naturel sur une structure en bois durable."}'::jsonb,
  'linen-play-tent', 129.00, null, 'WK-PLY-001', 8,
  c.id,
  ARRAY['https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['tent','linen','play','cosy'], false, true, '2+ years', 'Wigiwama'
FROM categories c WHERE c.slug = 'toys-play'
AND NOT EXISTS (SELECT 1 FROM products WHERE slug = 'linen-play-tent');

INSERT INTO products (name, description, slug, price, compare_price, sku, stock, category_id, images, tags, featured, is_new, age_range, brand)
SELECT
  '{"en":"Bamboo Dinner Set","de":"Bambus-Geschirrset","it":"Set per la cena in bambù","fr":"Service de table en bambou"}'::jsonb,
  '{"en":"Complete bamboo dinner set with plate, bowl and cup. Dishwasher safe, BPA-free and sustainably made.","de":"Komplettes Bambus-Geschirrset mit Teller, Schüssel und Becher. Spülmaschinenfest und BPA-frei.","it":"Completo set da pranzo in bambù con piatto, ciotola e tazza. Lavabile in lavastoviglie.","fr":"Service de table complet en bambou avec assiette, bol et tasse. Passe au lave-vaisselle."}'::jsonb,
  'bamboo-dinner-set', 38.00, null, 'WK-HOM-001', 30,
  c.id,
  ARRAY['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['bamboo','dinnerware','eco','home'], false, false, '1+ years', 'Miniware'
FROM categories c WHERE c.slug = 'home-living'
AND NOT EXISTS (SELECT 1 FROM products WHERE slug = 'bamboo-dinner-set');

INSERT INTO products (name, description, slug, price, compare_price, sku, stock, category_id, images, tags, featured, is_new, age_range, brand)
SELECT
  '{"en":"The Very Hungry Caterpillar","de":"Die kleine Raupe Nimmersatt","it":"Il Piccolo Bruco Maisazio","fr":"La Chenille qui fait des trous"}'::jsonb,
  '{"en":"Eric Carle''s timeless classic in a beautiful board book edition. A story of growth and transformation.","de":"Eric Carles zeitloser Klassiker als Pappbuch-Edition.","it":"Il classico senza tempo di Eric Carle in edizione cartonata.","fr":"Le grand classique d''Eric Carle dans une belle édition cartonnée."}'::jsonb,
  'very-hungry-caterpillar', 14.00, null, 'WK-BOK-001', 50,
  c.id,
  ARRAY['https://images.pexels.com/photos/1148399/pexels-photo-1148399.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['book','classic','picture-book'], false, false, '0-3 years', 'Eric Carle'
FROM categories c WHERE c.slug = 'books'
AND NOT EXISTS (SELECT 1 FROM products WHERE slug = 'very-hungry-caterpillar');

INSERT INTO products (name, description, slug, price, compare_price, sku, stock, category_id, images, tags, featured, is_new, age_range, brand)
SELECT
  '{"en":"Knitted Baby Booties","de":"Gestrickte Baby-Schühchen","it":"Scarpine da neonato in maglia","fr":"Chaussons en tricot pour bébé"}'::jsonb,
  '{"en":"Hand-knitted merino wool booties. Naturally temperature-regulating, breathable and soft against newborn skin.","de":"Handgestrickte Merino-Woll-Schühchen. Natürlich temperaturregulierend und weich.","it":"Scarpine in lana merino a maglia. Termo-regolante naturale e morbide.","fr":"Chaussons en laine mérinos tricotés à la main. Naturellement régulateur de température."}'::jsonb,
  'knitted-baby-booties', 24.00, 30.00, 'WK-CLO-002', 20,
  c.id,
  ARRAY['https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['merino','knit','baby','booties'], true, false, '0-12 months', 'Stuckies'
FROM categories c WHERE c.slug = 'clothing'
AND NOT EXISTS (SELECT 1 FROM products WHERE slug = 'knitted-baby-booties');

-- Blog posts
INSERT INTO blog_posts (slug, title, excerpt, content, cover_image, author, tags, published, published_at)
VALUES (
  'power-of-open-ended-play',
  '{"en":"The Power of Open-Ended Play","de":"Die Kraft des offenen Spielens","it":"Il Potere del Gioco Libero","fr":"Le Pouvoir du Jeu Ouvert"}'::jsonb,
  '{"en":"Discover why unstructured play with open-ended toys is the most powerful gift you can give your child''s developing mind.","de":"Warum unstrukturiertes Spielen das mächtigste Geschenk für den Geist Ihres Kindes ist.","it":"Perché il gioco non strutturato è il dono più potente per la mente di tuo figlio.","fr":"Pourquoi le jeu non structuré est le cadeau le plus puissant pour l''esprit de votre enfant."}'::jsonb,
  '{"en":"<h2>What is Open-Ended Play?</h2><p>Open-ended play refers to play activities that have no fixed rules, goals or single correct outcome. The child decides what something becomes, how it works and what story it tells.</p><p>Wooden blocks become a castle, a city or a mountain range. A balance board becomes a boat, a bridge or a stage.</p><h2>Why It Matters</h2><p>Research consistently shows that children engaged in open-ended play develop stronger executive function, deeper creativity and more robust problem-solving skills than those limited to single-purpose toys.</p><h2>Choosing the Right Toys</h2><p>When selecting open-ended toys, look for materials that are beautiful and honest — real wood, natural fibres, simple geometric forms. The best open-ended toys are used from infancy well into the primary school years.</p>","de":"<h2>Was ist offenes Spielen?</h2><p>Offenes Spielen bezeichnet Spielaktivitäten ohne feste Regeln oder einzig richtige Ergebnisse.</p>","it":"<h2>Cos''è il gioco aperto?</h2><p>Il gioco aperto si riferisce ad attività senza regole fisse o un unico risultato corretto.</p>","fr":"<h2>Qu''est-ce que le jeu ouvert ?</h2><p>Le jeu ouvert désigne des activités sans règles fixes ou résultat unique correct.</p>"}'::jsonb,
  'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Wonderkind Team', ARRAY['play','waldorf','education','toys'], true, now() - interval '10 days'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_posts (slug, title, excerpt, content, cover_image, author, tags, published, published_at)
VALUES (
  'choosing-organic-why-it-matters',
  '{"en":"Choosing Organic: Why It Matters for Your Baby","de":"Bio wählen: Warum es für Ihr Baby wichtig ist","it":"Scegliere il biologico: perché è importante","fr":"Choisir le bio : pourquoi c''est important pour votre bébé"}'::jsonb,
  '{"en":"Newborn skin is up to five times more permeable than adult skin. Here''s why GOTS-certified organic clothing is worth every cent.","de":"Die Haut von Neugeborenen ist bis zu fünfmal durchlässiger. GOTS-zertifizierte Bio-Kleidung lohnt sich.","it":"La pelle dei neonati è fino a cinque volte più permeabile. Ecco perché l''abbigliamento biologico GOTS vale ogni centesimo.","fr":"La peau des nouveau-nés est jusqu''à cinq fois plus perméable. Voici pourquoi les vêtements bio certifiés GOTS valent chaque centime."}'::jsonb,
  '{"en":"<h2>The Science of Baby Skin</h2><p>A newborn''s skin barrier is not yet fully developed. It absorbs substances far more readily than adult skin — including residual pesticides and synthetic dyes that remain in conventionally produced textiles even after washing.</p><h2>What GOTS Certification Means</h2><p>The Global Organic Textile Standard covers the entire production chain — from farming through dyeing and finishing to labelling. A GOTS label means no toxic chemicals anywhere in the supply chain.</p><h2>Better for the Planet Too</h2><p>Organic cotton farming uses 91% less water than conventional cotton and avoids synthetic pesticides that damage soil and contaminate waterways.</p>","de":"<h2>Die Wissenschaft der Babyhaut</h2><p>Die Hautbarriere eines Neugeborenen ist noch nicht vollständig entwickelt und absorbiert Substanzen viel leichter.</p>","it":"<h2>La scienza della pelle del neonato</h2><p>La barriera cutanea di un neonato non è ancora completamente sviluppata.</p>","fr":"<h2>La science de la peau de bébé</h2><p>La barrière cutanée d''un nouveau-né n''est pas encore entièrement développée.</p>"}'::jsonb,
  'https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Wonderkind Team', ARRAY['organic','clothing','baby','health'], true, now() - interval '5 days'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_posts (slug, title, excerpt, content, cover_image, author, tags, published, published_at)
VALUES (
  'waldorf-toys-guide',
  '{"en":"A Guide to Waldorf-Inspired Toys","de":"Ein Leitfaden zu waldorfinspiriertem Spielzeug","it":"Una guida ai giocattoli ispirati Waldorf","fr":"Guide des jouets d''inspiration Waldorf"}'::jsonb,
  '{"en":"What makes a toy truly Waldorf? We explore the principles behind this enduring philosophy and the toys that embody them best.","de":"Was macht ein Spielzeug wirklich waldorfinspiriert? Wir erkunden diese dauerhaften Prinzipien.","it":"Cosa rende un giocattolo veramente Waldorf? Esploriamo i principi di questa filosofia.","fr":"Qu''est-ce qui rend un jouet vraiment Waldorf ? Nous explorons les principes de cette philosophie."}'::jsonb,
  '{"en":"<h2>Rudolf Steiner''s Vision</h2><p>Waldorf education holds that childhood is a sacred phase of development that should not be hurried. The toys that belong in this world speak to the whole child — imagination, movement, emotion and sense.</p><h2>The Core Principles</h2><p>Waldorf toys are characterised by natural materials, unfinished forms and honest beauty. A Waldorf doll has a softly suggested face, leaving space for the child to project whatever emotion the story requires.</p><h2>Our Top Recommendations</h2><p>From Grimm''s rainbow stackers to Ostheimer wooden animals, the brands we carry at Wonderkind embody these principles without compromise.</p>","de":"<h2>Rudolf Steiners Vision</h2><p>Die Waldorf-Pädagogik hält daran fest, dass die Kindheit eine heilige Entwicklungsphase ist.</p>","it":"<h2>La visione di Rudolf Steiner</h2><p>L''educazione Waldorf ritiene che l''infanzia sia una fase sacra dello sviluppo.</p>","fr":"<h2>La vision de Rudolf Steiner</h2><p>L''éducation Waldorf considère que l''enfance est une phase sacrée du développement.</p>"}'::jsonb,
  'https://images.pexels.com/photos/3933025/pexels-photo-3933025.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Wonderkind Team', ARRAY['waldorf','toys','education','philosophy'], true, now() - interval '2 days'
) ON CONFLICT (slug) DO NOTHING;
