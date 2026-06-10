
-- =====================================================
-- Ogelo Real Product Catalog
-- 7 product lines from the Ogelo Amazon store
-- =====================================================

-- Deactivate all old demo/placeholder products
UPDATE products SET is_active = false;

-- Fix blog post author
UPDATE blog_posts SET author = 'ogelo Team' WHERE author ILIKE '%wonderkind%' OR author = 'Wonderkind Team';

-- Update category images to match Ogelo's actual product range
UPDATE categories SET image = 'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE slug = 'toys-play';
UPDATE categories SET image = 'https://images.pexels.com/photos/3933025/pexels-photo-3933025.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE slug = 'clothing';
UPDATE categories SET image = 'https://images.pexels.com/photos/3669638/pexels-photo-3669638.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE slug = 'art-craft';
UPDATE categories SET image = 'https://images.pexels.com/photos/4148838/pexels-photo-4148838.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE slug = 'books';
UPDATE categories SET image = 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE slug = 'baby-nursery';
UPDATE categories SET image = 'https://images.pexels.com/photos/4559592/pexels-photo-4559592.jpeg?auto=compress&cs=tinysrgb&w=800' WHERE slug = 'home-living';

-- ─────────────────────────────────────────────────────
-- PRODUCT 1: Indoor Playground 7-in-1 (B0C2PMS9J9)
-- ─────────────────────────────────────────────────────
INSERT INTO products (name, description, slug, price, compare_price, sku, stock, category_id, images, tags, featured, is_new, age_range, brand, is_active)
SELECT
  '{"en":"Indoor Playground 7-in-1 Toddler Playset","de":"Indoor-Spielplatz 7-in-1 Kleinkind-Set","it":"Parco giochi indoor 7-in-1 per bambini","fr":"Aire de jeux intérieure 7-en-1"}'::jsonb,
  '{"en":"<p>The ultimate indoor adventure for toddlers. This 7-in-1 playset features a Jungle Gym, Climbing Net Ramp, Slide, Swing, Monkey Bars, Rope Ladder, and Rock Wall Dome — giving your child hours of active, imaginative play without ever leaving the house.</p><p>Crafted from FSC-certified solid pine wood with smooth, splinter-free surfaces and non-toxic water-based finishes. Hardware-grade bolts and safety-tested joints rated for up to 100 kg.</p><ul><li>7-in-1: Jungle Gym · Climbing Ramp · Slide · Swing · Monkey Bars · Rope Ladder · Rock Wall</li><li>Material: FSC-certified solid pine wood</li><li>Finish: Non-toxic, water-based paint</li><li>Max load: 100 kg</li><li>Age: 1–6 years</li><li>CE &amp; EN71 certified</li><li>Tools included for easy assembly</li></ul>","de":"<p>Das ultimative Indoor-Abenteuer für Kleinkinder. Das 7-in-1-Spielset enthält Dschungelgym, Kletter-Rampe, Rutsche, Schaukel, Affenstangen, Seilleiter und Kletterfelsen.</p><ul><li>7-in-1: Dschungelgym · Kletterrampe · Rutsche · Schaukel · Affenstangen · Seilleiter · Kletterfelsen</li><li>Material: FSC-zertifiziertes Kiefern-Massivholz</li><li>Max. Last: 100 kg · Alter: 1–6 Jahre</li><li>CE &amp; EN71 zertifiziert</li></ul>","it":"<p>L''avventura indoor definitiva per i bambini. Il set 7-in-1 include jungle gym, rampa da arrampicata, scivolo, altalena, sbarre, scala di corda e parete rocciosa.</p><ul><li>7-in-1: Jungle Gym · Rampa · Scivolo · Altalena · Sbarre · Scala corda · Parete rocciosa</li><li>Pino massiccio certificato FSC · Età: 1–6 anni · Certificato CE &amp; EN71</li></ul>","fr":"<p>L''aventure intérieure ultime pour les tout-petits. Ce playset 7-en-1 comprend jungle gym, rampe d''escalade, toboggan, balançoire, barres de singe, échelle de corde et mur d''escalade.</p><ul><li>7-en-1 : Jungle Gym · Rampe · Toboggan · Balançoire · Barres · Échelle de corde · Mur</li><li>Pin massif certifié FSC · Âge : 1–6 ans · Certifié CE &amp; EN71</li></ul>"}'::jsonb,
  'indoor-playground-7-in-1',
  279.99, 349.99, 'B0C2PMS9J9', 30,
  (SELECT id FROM categories WHERE slug = 'toys-play'),
  ARRAY[
    'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3933025/pexels-photo-3933025.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  ARRAY['indoor','playground','climbing','jungle-gym','slide','swing','wooden','7-in-1'],
  true, true, '1–6 years', 'ogelo', true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'indoor-playground-7-in-1');

-- ─────────────────────────────────────────────────────
-- PRODUCT 2: Educating Tower 3-in-1
-- ─────────────────────────────────────────────────────
INSERT INTO products (name, description, slug, price, compare_price, sku, stock, category_id, images, tags, featured, is_new, age_range, brand, is_active)
SELECT
  '{"en":"Educating Tower 3-in-1 (Tower + High Chair + Step Stool)","de":"Lernturm 3-in-1 (Turm + Hochstuhl + Tritthocker)","it":"Torre educativa 3-in-1 (Torre + Seggiolone + Sgabello)","fr":"Tour éducative 3-en-1 (Tour + Chaise haute + Marchepied)"}'::jsonb,
  '{"en":"<p>Give your child the gift of independence. The ogelo Educating Tower converts between a Learning Tower, High Chair, and Step Stool — growing with your child from 1 to 10 years old.</p><p>Adjustable platform height fits children of all sizes. Solid wood construction with rounded safety rails ensures your little one can safely stand at counter height and be part of family activities like cooking, baking and art.</p><ul><li>3-in-1: Learning Tower · High Chair · Step Stool</li><li>Adjustable platform height: 3 levels</li><li>Material: FSC-certified solid birch wood</li><li>Safety rails on all sides</li><li>Age: 1–10 years · Max load: 50 kg</li><li>CE certified</li></ul>","de":"<p>Geben Sie Ihrem Kind die Gabe der Unabhängigkeit. Der ogelo Lernturm verwandelt sich in Lernturm, Hochstuhl und Tritthocker – wächst mit Ihrem Kind von 1 bis 10 Jahren.</p><ul><li>3-in-1: Lernturm · Hochstuhl · Tritthocker</li><li>Verstellbare Plattformhöhe: 3 Stufen</li><li>Material: FSC-zertifiziertes Birkenholz</li><li>Alter: 1–10 Jahre · Max. Last: 50 kg · CE zertifiziert</li></ul>","it":"<p>Dona a tuo figlio il dono dell''indipendenza. La torre educativa ogelo si trasforma in torre di apprendimento, seggiolone e sgabello — cresce con tuo figlio da 1 a 10 anni.</p><ul><li>3-in-1: Torre di apprendimento · Seggiolone · Sgabello</li><li>Altezza piattaforma regolabile: 3 livelli</li><li>Betulla massiccia certificata FSC · Età: 1–10 anni · CE</li></ul>","fr":"<p>Offrez à votre enfant le cadeau de l''indépendance. La tour éducative ogelo se transforme en tour d''apprentissage, chaise haute et marchepied — grandit avec votre enfant de 1 à 10 ans.</p><ul><li>3-en-1 : Tour d''apprentissage · Chaise haute · Marchepied</li><li>Hauteur de plateforme réglable : 3 niveaux</li><li>Bouleau massif certifié FSC · Âge : 1–10 ans · Certifié CE</li></ul>"}'::jsonb,
  'educating-tower-3-in-1',
  129.99, 159.99, 'OG-ET-3001', 25,
  (SELECT id FROM categories WHERE slug = 'books'),
  ARRAY[
    'https://images.pexels.com/photos/5692246/pexels-photo-5692246.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4148838/pexels-photo-4148838.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3933025/pexels-photo-3933025.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  ARRAY['learning-tower','step-stool','high-chair','wooden','montessori','kitchen'],
  true, false, '1–10 years', 'ogelo', true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'educating-tower-3-in-1');

-- ─────────────────────────────────────────────────────
-- PRODUCT 3: Climber Frame (Pikler Triangle style)
-- ─────────────────────────────────────────────────────
INSERT INTO products (name, description, slug, price, compare_price, sku, stock, category_id, images, tags, featured, is_new, age_range, brand, is_active)
SELECT
  '{"en":"Climber Frame — Play, Learn & Grow","de":"Kletterrahmen — Spielen, Lernen & Wachsen","it":"Struttura da arrampicata — Gioca, Impara e Cresci","fr":"Cadre d''escalade — Jouer, Apprendre & Grandir"}'::jsonb,
  '{"en":"<p>The ogelo Climber Frame is a Montessori-inspired freestanding climbing structure that encourages children to explore their physical limits in a safe, controlled environment. Its open-ended design supports climbing, balancing, pulling and imaginative play.</p><ul><li>Freestanding — no wall fixings needed</li><li>Material: FSC-certified solid pine wood</li><li>Smooth rounded rungs, splinter-free</li><li>Foldable for easy storage</li><li>Age: 1–5 years · Max load: 80 kg</li><li>CE &amp; EN71 certified</li></ul>","de":"<p>Der ogelo Kletterrahmen ist eine Montessori-inspirierte freistehende Kletterstruktur, die Kinder ermutigt, ihre körperlichen Grenzen sicher zu erkunden.</p><ul><li>Freistehend – keine Wandbefestigung nötig</li><li>Material: FSC-zertifiziertes Kiefernholz</li><li>Glatte, runde Sprossen, splitterfrei · Faltbar</li><li>Alter: 1–5 Jahre · Max. Last: 80 kg · CE &amp; EN71</li></ul>","it":"<p>La struttura da arrampicata ogelo è una struttura Montessori autoportante che incoraggia i bambini a esplorare i loro limiti fisici in modo sicuro.</p><ul><li>Autoportante – nessun fissaggio a parete</li><li>Pino massiccio FSC · Pieghevole · Età: 1–5 anni · CE &amp; EN71</li></ul>","fr":"<p>Le cadre d''escalade ogelo est une structure d''escalade Montessori autoportante qui encourage les enfants à explorer leurs limites physiques en toute sécurité.</p><ul><li>Autoportant – pas de fixation murale</li><li>Pin massif FSC · Pliable · Âge : 1–5 ans · Certifié CE &amp; EN71</li></ul>"}'::jsonb,
  'climber-frame',
  169.99, 209.99, 'OG-CF-001', 20,
  (SELECT id FROM categories WHERE slug = 'clothing'),
  ARRAY[
    'https://images.pexels.com/photos/3669638/pexels-photo-3669638.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  ARRAY['climbing','frame','pikler','montessori','foldable','wooden'],
  false, true, '1–5 years', 'ogelo', true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'climber-frame');

-- ─────────────────────────────────────────────────────
-- PRODUCT 4: Climbing Toys 3-in-1 (Slide & Rock Wall)
-- ─────────────────────────────────────────────────────
INSERT INTO products (name, description, slug, price, compare_price, sku, stock, category_id, images, tags, featured, is_new, age_range, brand, is_active)
SELECT
  '{"en":"3-in-1 Climbing Toys with Slide & Rock Wall","de":"3-in-1 Klettergeräte mit Rutsche & Kletterwand","it":"Giochi da arrampicata 3-in-1 con scivolo e parete rocciosa","fr":"Jeux d''escalade 3-en-1 avec toboggan et mur d''escalade"}'::jsonb,
  '{"en":"<p>Three exciting play experiences in one compact wooden set. The ogelo 3-in-1 Climbing Toys combine a natural wood Slide, Rock Wall climbing panel, and a versatile Arch Ramp — perfect for toddlers discovering the joy of active movement.</p><ul><li>3-in-1: Slide · Rock Wall · Arch Ramp</li><li>Material: Natural solid pine wood</li><li>Rock wall with colorful climbing grips included</li><li>Reversible arch: use as ramp or rocker</li><li>Age: 1–5 years · Max load: 60 kg</li><li>CE &amp; EN71 certified</li></ul>","de":"<p>Drei aufregende Spielerlebnisse in einem kompakten Holzset. Das ogelo 3-in-1-Klettergerät kombiniert Rutsche, Kletterwand und Bogenrampe.</p><ul><li>3-in-1: Rutsche · Kletterwand · Bogenrampe</li><li>Naturholz Kiefer · Kletterwand mit bunten Griffen</li><li>Alter: 1–5 Jahre · Max. Last: 60 kg · CE &amp; EN71</li></ul>","it":"<p>Tre esperienze di gioco in un unico set in legno compatto. I giochi da arrampicata 3-in-1 ogelo combinano scivolo in legno naturale, parete rocciosa e rampa ad arco.</p><ul><li>3-in-1: Scivolo · Parete rocciosa · Rampa ad arco</li><li>Pino naturale · Età: 1–5 anni · CE &amp; EN71</li></ul>","fr":"<p>Trois expériences de jeu passionnantes dans un seul ensemble en bois compact. Les jeux d''escalade 3-en-1 ogelo combinent toboggan en bois naturel, mur d''escalade et rampe en arche.</p><ul><li>3-en-1 : Toboggan · Mur d''escalade · Rampe en arche</li><li>Pin naturel · Âge : 1–5 ans · Certifié CE &amp; EN71</li></ul>"}'::jsonb,
  'climbing-toys-3-in-1',
  199.99, 249.99, 'OG-CT-3001', 18,
  (SELECT id FROM categories WHERE slug = 'clothing'),
  ARRAY[
    'https://images.pexels.com/photos/3933025/pexels-photo-3933025.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  ARRAY['climbing','slide','rock-wall','arch','wooden','3-in-1'],
  false, false, '1–5 years', 'ogelo', true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'climbing-toys-3-in-1');

-- ─────────────────────────────────────────────────────
-- PRODUCT 5: Toddler Playset Folding 7-in-1
-- ─────────────────────────────────────────────────────
INSERT INTO products (name, description, slug, price, compare_price, sku, stock, category_id, images, tags, featured, is_new, age_range, brand, is_active)
SELECT
  '{"en":"Toddler Playset Folding 7-in-1 Indoor Playground","de":"Kleinkind-Spielset Faltbar 7-in-1 Indoor-Spielplatz","it":"Playset pieghevole 7-in-1 per bambini","fr":"Playset pliable 7-en-1 pour tout-petits"}'::jsonb,
  '{"en":"<p>All the fun of a full indoor playground — foldable for convenient storage when playtime is over. The ogelo Folding 7-in-1 Toddler Playset is designed for small spaces without compromising on adventure.</p><p>Unfolds in minutes. Folds flat against the wall or slides under a bed when not in use.</p><ul><li>7-in-1: Jungle Gym · Ramp · Slide · Swing · Monkey Bars · Rope Ladder · Climber</li><li>Foldable design — compact storage</li><li>Material: FSC-certified solid pine wood</li><li>Age: 1–5 years · Max load: 80 kg</li><li>CE &amp; EN71 certified</li></ul>","de":"<p>Der ganze Spaß eines vollständigen Indoor-Spielplatzes — faltbar für einfache Aufbewahrung. Das ogelo 7-in-1 Falt-Spielset ist für kleine Räume konzipiert.</p><ul><li>7-in-1: Dschungelgym · Rampe · Rutsche · Schaukel · Affenstangen · Seilleiter · Klettergerät</li><li>Faltbares Design · FSC-Kiefer · Alter: 1–5 Jahre · CE &amp; EN71</li></ul>","it":"<p>Tutto il divertimento di un parco giochi indoor completo — pieghevole per una comoda conservazione. Il playset pieghevole ogelo 7-in-1 è progettato per spazi ridotti.</p><ul><li>7-in-1: Jungle Gym · Rampa · Scivolo · Altalena · Sbarre · Scala corda · Scalatore</li><li>Design pieghevole · Pino FSC · Età: 1–5 anni · CE &amp; EN71</li></ul>","fr":"<p>Tout le plaisir d''une aire de jeux intérieure complète — pliable pour un rangement pratique. Le playset pliant ogelo 7-en-1 est conçu pour les petits espaces.</p><ul><li>7-en-1 : Jungle Gym · Rampe · Toboggan · Balançoire · Barres · Échelle · Grimpeur</li><li>Design pliant · Pin FSC · Âge : 1–5 ans · Certifié CE &amp; EN71</li></ul>"}'::jsonb,
  'toddler-playset-folding-7-in-1',
  249.99, 299.99, 'OG-TP-7001', 22,
  (SELECT id FROM categories WHERE slug = 'baby-nursery'),
  ARRAY[
    'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3933025/pexels-photo-3933025.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  ARRAY['toddler','playset','folding','indoor','playground','7-in-1','compact'],
  true, false, '1–5 years', 'ogelo', true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'toddler-playset-folding-7-in-1');

-- ─────────────────────────────────────────────────────
-- PRODUCT 6: Multifunctional Bookshelf Toy Organizer (ZS0101 / B0CFXVNRXZ)
-- ─────────────────────────────────────────────────────
INSERT INTO products (name, description, slug, price, compare_price, sku, stock, category_id, images, tags, featured, is_new, age_range, brand, is_active)
SELECT
  '{"en":"Multifunctional Bookshelf & Toy Organizer","de":"Multifunktionales Bücherregal & Spielzeug-Organizer","it":"Libreria multifunzionale e organizer per giocattoli","fr":"Bibliothèque multifonctionnelle et organiseur de jouets"}'::jsonb,
  '{"en":"<p>Keep the playroom tidy and beautiful with the ogelo Multifunctional Bookshelf & Toy Organizer. Six open compartments organize books, toys, art supplies and more — while the thoughtful wooden design adds warmth to any room.</p><p>Suitable for playrooms, bedrooms, schools and kindergartens.</p><ul><li>6 open storage compartments</li><li>Displays books face-forward for easy access</li><li>Material: FSC-certified solid wood</li><li>Anti-tip wall anchor included</li><li>For all ages · Playroom, bedroom, classroom</li><li>CE certified</li></ul>","de":"<p>Halten Sie das Spielzimmer ordentlich und schön mit dem ogelo Multifunktionalen Bücherregal & Spielzeug-Organizer. Sechs offene Fächer organisieren Bücher, Spielzeug, Bastelmaterial und mehr.</p><ul><li>6 offene Ablagefächer · Bücher von vorn sichtbar</li><li>FSC-zertifiziertes Holz · Kippsicherung inklusive</li><li>Für alle Altersgruppen · CE zertifiziert</li></ul>","it":"<p>Mantieni la stanza dei giochi ordinata e bella con la libreria multifunzionale ogelo. Sei vani aperti organizzano libri, giocattoli, materiale artistico e molto altro.</p><ul><li>6 vani aperti · Libri visibili frontalmente</li><li>Legno massiccio FSC · Anchoring anti-ribaltamento incluso · CE</li></ul>","fr":"<p>Gardez la salle de jeux ordonnée et belle avec la bibliothèque multifonctionnelle ogelo. Six compartiments ouverts organisent livres, jouets, fournitures artistiques et plus encore.</p><ul><li>6 compartiments ouverts · Livres visibles de face</li><li>Bois massif FSC · Ancrage anti-basculement inclus · CE</li></ul>"}'::jsonb,
  'bookshelf-toy-organizer',
  79.99, 99.99, 'ZS0101', 40,
  (SELECT id FROM categories WHERE slug = 'home-living'),
  ARRAY[
    'https://images.pexels.com/photos/4559592/pexels-photo-4559592.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1148399/pexels-photo-1148399.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  ARRAY['bookshelf','organizer','storage','wooden','playroom','kids','toy-storage'],
  false, true, 'All ages', 'ogelo', true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'bookshelf-toy-organizer');

-- ─────────────────────────────────────────────────────
-- PRODUCT 7: Toddler Wood Frame 8-in-1 (B0G1M5892Z)
-- ─────────────────────────────────────────────────────
INSERT INTO products (name, description, slug, price, compare_price, sku, stock, category_id, images, tags, featured, is_new, age_range, brand, is_active)
SELECT
  '{"en":"Toddler Wood Frame 8-in-1 Indoor Playground","de":"Kleinkind-Holzrahmen 8-in-1 Indoor-Spielplatz","it":"Struttura in legno 8-in-1 per bambini","fr":"Cadre en bois 8-en-1 pour tout-petits"}'::jsonb,
  '{"en":"<p>Our most complete indoor playground yet. The ogelo 8-in-1 Toddler Wood Frame adds Gymnastic Rings to the beloved 7-in-1 formula, creating a full-body workout and play experience for children aged 1–6.</p><p>Heavy-duty solid wood frame with anti-scratch rubber feet. All accessories included — just assemble and play.</p><ul><li>8-in-1: Jungle Gym · Triangle Climber Ramp · Slide · Swing · Swedish Ladder · Monkey Bars · Rope Ladder · Rock Wall</li><li>Material: FSC-certified solid pine wood</li><li>Anti-scratch rubber feet · Hardware included</li><li>Age: 1–6 years · Max load: 100 kg</li><li>CE &amp; EN71 certified</li></ul>","de":"<p>Unser bisher vollständigster Indoor-Spielplatz. Der ogelo 8-in-1 Holzrahmen fügt Turnringe zur bewährten 7-in-1-Formel hinzu.</p><ul><li>8-in-1: Dschungelgym · Dreieck-Rampe · Rutsche · Schaukel · Schwedische Leiter · Affenstangen · Seilleiter · Kletterfelsen</li><li>FSC-Kiefer · Gummifüße · Alter: 1–6 Jahre · CE &amp; EN71</li></ul>","it":"<p>Il nostro parco giochi indoor più completo. La struttura in legno 8-in-1 ogelo aggiunge gli anelli ginnici alla formula 7-in-1.</p><ul><li>8-in-1: Jungle Gym · Rampa triangolare · Scivolo · Altalena · Scala svedese · Sbarre · Scala corda · Parete rocciosa</li><li>Pino FSC · Età: 1–6 anni · CE &amp; EN71</li></ul>","fr":"<p>Notre aire de jeux intérieure la plus complète. Le cadre en bois 8-en-1 ogelo ajoute des anneaux de gymnastique à la formule 7-en-1.</p><ul><li>8-en-1 : Jungle Gym · Rampe triangle · Toboggan · Balançoire · Échelle suédoise · Barres · Échelle de corde · Mur d''escalade</li><li>Pin FSC · Âge : 1–6 ans · Certifié CE &amp; EN71</li></ul>"}'::jsonb,
  'toddler-wood-frame-8-in-1',
  299.99, 369.99, 'B0G1M5892Z', 15,
  (SELECT id FROM categories WHERE slug = 'toys-play'),
  ARRAY[
    'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3933025/pexels-photo-3933025.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  ARRAY['indoor','playground','8-in-1','climbing','wooden','jungle-gym','gymnastic-rings'],
  false, true, '1–6 years', 'ogelo', true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'toddler-wood-frame-8-in-1');
