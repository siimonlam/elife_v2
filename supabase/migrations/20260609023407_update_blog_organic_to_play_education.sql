UPDATE blog_posts SET
  title = '{
    "en": "How Play-Based Learning Shapes Your Child''s Brain",
    "de": "Wie spielbasiertes Lernen das Gehirn Ihres Kindes formt",
    "fr": "Comment l''apprentissage par le jeu façonne le cerveau de votre enfant",
    "it": "Come l''apprendimento attraverso il gioco modella il cervello di tuo figlio"
  }'::jsonb,
  excerpt = '{
    "en": "Play is not just fun — it is the primary way young children build cognitive, social, and motor skills. Discover the science behind play-based education.",
    "de": "Spielen ist nicht nur Spaß — es ist der wichtigste Weg, wie Kinder kognitive, soziale und motorische Fähigkeiten aufbauen.",
    "fr": "Le jeu n''est pas seulement amusant — c''est la principale façon dont les jeunes enfants développent leurs compétences cognitives, sociales et motrices.",
    "it": "Il gioco non è solo divertimento — è il modo principale in cui i bambini sviluppano abilità cognitive, sociali e motorie."
  }'::jsonb,
  content = '{
    "en": "<h2>Why Play Is Serious Business</h2><p>Neuroscience confirms what parents intuitively sense: children learn best when they are playing. During play, the brain releases dopamine, strengthening neural pathways related to memory, problem-solving, and creativity. The first five years of life see more synaptic connections form than at any other stage — and free play is the engine behind much of that growth.</p><h2>The Montessori & Waldorf Approach</h2><p>Both Montessori and Waldorf philosophies place play at the heart of early education. Rather than rote memorisation, children are guided to explore, create, and discover through hands-on materials and open-ended toys. Wooden climbing frames, learning towers, and imaginative playsets invite children to set their own challenges and build confidence through physical mastery.</p><h2>Physical Play and Gross Motor Development</h2><p>Climbing, balancing, and sliding are not just physical activities — they are critical for developing spatial awareness, risk assessment, and self-regulation. Indoor playgrounds designed with natural materials give children a safe environment to push their limits every day, regardless of weather.</p><h2>Choosing the Right Play Equipment</h2><p>Look for open-ended toys made from natural wood — materials that engage all the senses and age with the child. Equipment that grows with your child, offering new challenges at each developmental stage, delivers far more value than single-purpose plastic toys.</p>",
    "de": "<h2>Warum Spielen ernsthaft wichtig ist</h2><p>Die Neurowissenschaft bestätigt, was Eltern instinktiv spüren: Kinder lernen am besten, wenn sie spielen. Offene Holzspielzeuge und Kletterrahmen laden Kinder ein, ihre eigenen Herausforderungen zu setzen.</p>",
    "fr": "<h2>Pourquoi le jeu est une affaire sérieuse</h2><p>Les neurosciences confirment ce que les parents sentent intuitivement : les enfants apprennent mieux quand ils jouent. Les jeux en bois ouverts invitent les enfants à relever leurs propres défis.</p>",
    "it": "<h2>Perché il gioco è una cosa seria</h2><p>Le neuroscienze confermano ciò che i genitori sentono intuitivamente: i bambini imparano meglio quando giocano. I giochi in legno aperti invitano i bambini a stabilire le proprie sfide.</p>"
  }'::jsonb,
  tags = ARRAY['education', 'play', 'development', 'montessori'],
  cover_image = 'https://images.pexels.com/photos/8535186/pexels-photo-8535186.jpeg?auto=compress&cs=tinysrgb&w=1200'
WHERE id = '24042a54-9a01-4b3d-83a4-3483ca37fded';
