
-- Delete all existing products
DELETE FROM products;

-- Insert 4 Ogelo products
INSERT INTO products (name, description, slug, price, compare_price, sku, stock, category_id, images, tags, featured, is_new, is_active, age_range, brand) VALUES
(
  '{"en": "Foldable Wooden Indoor Climbing Frame", "de": "Faltbares Holz-Klettergerüst für drinnen", "fr": "Structure d''escalade intérieure en bois pliable", "it": "Struttura arrampicata pieghevole in legno per interni"}',
  '{"en": "The Ogelo foldable wooden indoor climbing frame turns any living room into a safe adventure zone. Crafted from solid birch wood with smooth rounded edges, it folds flat for easy storage when not in use. Features climbing rungs, a rope ladder, and a wooden platform that build strength, balance, and coordination in young children.", "de": "Das faltbare Holz-Klettergerüst von Ogelo verwandelt jedes Wohnzimmer in eine sichere Abenteuerwelt. Aus massiver Birke gefertigt, lässt es sich flach zusammenklappen. Mit Klettersprosse, Strickleiter und Holzplattform.", "fr": "La structure d''escalade pliable Ogelo transforme votre salon en zone d''aventure sécurisée. Fabriquée en bouleau massif, elle se replie à plat pour un rangement facile.", "it": "La struttura arrampicata pieghevole Ogelo trasforma il soggiorno in una zona avventura sicura. Realizzata in betulla massiccia, si piega piatta per una facile conservazione."}',
  'ogelo-foldable-wooden-indoor-climbing-frame',
  329.00,
  399.00,
  'OGL-B0B3QNZ462',
  25,
  'cbe975ee-cd74-4ed0-a6f3-0782e201a161',
  ARRAY[
    'https://images.pexels.com/photos/5692235/pexels-photo-5692235.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/6546041/pexels-photo-6546041.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  ARRAY['climbing', 'wooden', 'indoor', 'foldable', 'active play'],
  true,
  false,
  true,
  '1-6 years',
  'Ogelo'
),
(
  '{"en": "Montessori Learning Tower 3-in-1", "de": "Montessori Lernturm 3-in-1", "fr": "Tour d''apprentissage Montessori 3-en-1", "it": "Torre di apprendimento Montessori 3-in-1"}',
  '{"en": "The Ogelo Montessori Learning Tower 3-in-1 grows with your child. Use it as a learning tower to let toddlers safely reach counter height, convert it to a high chair for mealtimes, or use it as a step stool for everyday independence. Made from FSC-certified solid wood with a smooth natural finish and adjustable height platform.", "de": "Der Ogelo Montessori Lernturm 3-in-1 wächst mit Ihrem Kind. Als Lernturm, Hochstuhl oder Tritthocker — drei Funktionen in einem stabilen Holzmöbel.", "fr": "La tour d''apprentissage Montessori 3-en-1 d''Ogelo évolue avec votre enfant: tour d''apprentissage, chaise haute ou marchepied.", "it": "La torre Montessori 3-in-1 di Ogelo cresce con tuo figlio: torre di apprendimento, seggiolone o sgabello scalino."}',
  'montessori-learning-tower-3-in-1',
  249.00,
  299.00,
  'OGL-B09DSM21FM',
  30,
  '207aee1c-d80a-4ea9-8818-e61be6309ae1',
  ARRAY[
    'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/6393342/pexels-photo-6393342.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  ARRAY['montessori', 'learning tower', 'high chair', 'step stool', 'wooden'],
  true,
  true,
  true,
  '1-5 years',
  'Ogelo'
),
(
  '{"en": "Indoor Playground 9-in-1", "de": "Innerer Spielplatz 9-in-1", "fr": "Aire de jeux intérieure 9-en-1", "it": "Parco giochi indoor 9-in-1"}',
  '{"en": "The ultimate indoor playground for young adventurers. The Ogelo 9-in-1 features a slide, basketball hoop, swing, Swedish ladder, monkey bars, rope ladder, rock wall dome, and more — all in one freestanding wooden structure. Sized at 47\"L × 43\"W × 43\"H, it fits perfectly in living rooms and playrooms. Designed for ages 1–6.", "de": "Der ultimative Innen-Spielplatz. Das Ogelo 9-in-1 umfasst Rutsche, Basketballkorb, Schaukel, Sprossenwand, Klettergerüst, Strickleiter, Kletterkuppel und mehr. Maße: 119×109×109 cm.", "fr": "Le terrain de jeux intérieur ultime. Le 9-en-1 Ogelo comprend toboggan, panier de basket, balançoire, échelle suédoise, barre de singe, échelle de corde, dôme mural d''escalade.", "it": "Il parco giochi indoor definitivo. Il 9-in-1 Ogelo include scivolo, canestro da basket, altalena, spalliera, barre da scimmia, scala di corda, cupola arrampicata."}',
  'indoor-playground-9-in-1',
  489.00,
  589.00,
  'OGL-B0CPBPVXFL',
  18,
  '41152ea5-08cf-4719-98e4-4db4a89be1e0',
  ARRAY[
    'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  ARRAY['playground', 'slide', 'swing', 'climbing', 'indoor', '9-in-1'],
  true,
  true,
  true,
  '1-6 years',
  'Ogelo'
),
(
  '{"en": "Indoor Playground Wooden Toddler Playset with Jungle Gym & Rock Wall Dome", "de": "Innerer Holz-Spielplatz mit Dschungelturner & Kletterkuppel", "fr": "Aire de jeux en bois pour tout-petits avec jungle gym et dôme d''escalade", "it": "Parco giochi in legno per bambini piccoli con jungle gym e cupola arrampicata"}',
  '{"en": "Give your toddler the gift of active indoor play with the Ogelo Wooden Playset. This all-in-one jungle gym features a rock wall dome, climbing rungs, slide, and open play deck — all crafted from sustainably sourced solid wood. The open modular design encourages imaginative, physical play in the safety of your home.", "de": "Schenken Sie Ihrem Kleinkind aktives Spielen im Haus mit dem Ogelo Holzspielplatz. Mit Kletterkuppel, Klettersprosse, Rutsche und offenem Spielbereich aus nachhaltigem Holz.", "fr": "Offrez à votre enfant le plaisir du jeu actif en intérieur avec le Ogelo Playset en bois: dôme d''escalade, barreaux, toboggan et plateforme.", "it": "Regala al tuo bambino il gioco attivo indoor con il playset in legno Ogelo: cupola arrampicata, barre, scivolo e piattaforma aperta."}',
  'indoor-playground-wooden-toddler-playset',
  399.00,
  469.00,
  'OGL-B0CRB5VGBG',
  22,
  'cd61b3aa-854a-4dc2-8062-8bc33adfe35d',
  ARRAY[
    'https://images.pexels.com/photos/3661952/pexels-photo-3661952.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  ARRAY['playground', 'jungle gym', 'rock wall', 'wooden', 'toddler'],
  false,
  true,
  true,
  '1-5 years',
  'Ogelo'
);
