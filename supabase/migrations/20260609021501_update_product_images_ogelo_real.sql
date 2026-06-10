
-- Update product images with actual Ogelo Amazon product images

-- 1. Foldable Wooden Indoor Climbing Frame (B0B3QNZ462)
UPDATE products SET images = ARRAY[
  'https://m.media-amazon.com/images/I/61fo8Nu8cKL._AC_SL1500_.jpg',
  'https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/84ba7d52-f18c-4108-92cf-59ad3cac9440._CR0,0,3000,1600_SX1500_.jpg'
]
WHERE slug = 'ogelo-foldable-wooden-indoor-climbing-frame';

-- 2. Montessori Learning Tower 3-in-1 (B09DSM21FM)
UPDATE products SET images = ARRAY[
  'https://m.media-amazon.com/images/I/61F1pVQYq7L._AC_SL1500_.jpg',
  'https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/1ed25ba6-ea78-4020-92b6-19cdf0e3346d._CR0,0,1500,975_SX1500_.jpg'
]
WHERE slug = 'montessori-learning-tower-3-in-1';

-- 3. Indoor Playground 9-in-1 (B0CPBPVXFL)
UPDATE products SET images = ARRAY[
  'https://m.media-amazon.com/images/S/stores-image-uploads-na-prod/9/AmazonStores/ATVPDKIKX0DER/d675a76892af66a8026aa71993597eff.w1470.h975._CR0,0,1470,975_SX1500_.jpg'
]
WHERE slug = 'indoor-playground-9-in-1';

-- 4. Indoor Playground Wooden Toddler Playset (B0CRB5VGBG)
UPDATE products SET images = ARRAY[
  'https://m.media-amazon.com/images/S/stores-image-uploads-na-prod/f/AmazonStores/ATVPDKIKX0DER/f14a0b95ba804446bdd1001452d0c984.w1470.h975._CR0,0,1470,975_SX1500_.jpg'
]
WHERE slug = 'indoor-playground-wooden-toddler-playset';
