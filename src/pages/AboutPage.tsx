import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Heart, Globe, Users } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useSEO, buildOrganization, buildBreadcrumbs } from '../hooks/useSEO';

export default function AboutPage() {
  const { t, lang } = useLanguage();

  useSEO({
    title: t('seo', 'aboutTitle'),
    description: t('seo', 'aboutDescription'),
    lang,
    canonicalPath: '/about',
    ogImage: '/ogelo-banner.jpg',
    structuredData: [buildOrganization(), buildBreadcrumbs([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])],
  });

  const values = [
    { icon: Leaf, title: t('about', 'value1'), desc: lang === 'en' ? 'Every material chosen for safety and sustainability.' : lang === 'de' ? 'Jedes Material wird für Sicherheit und Nachhaltigkeit gewählt.' : lang === 'it' ? 'Ogni materiale scelto per sicurezza e sostenibilità.' : 'Chaque matériau choisi pour la sécurité et la durabilité.' },
    { icon: Heart, title: t('about', 'value2'), desc: lang === 'en' ? 'Toys and tools that inspire rather than direct.' : lang === 'de' ? 'Spielzeug und Werkzeuge, die inspirieren statt anleiten.' : lang === 'it' ? 'Giocattoli e strumenti che ispirano invece di dirigere.' : 'Des jouets et outils qui inspirent plutôt que de diriger.' },
    { icon: Globe, title: t('about', 'value3'), desc: lang === 'en' ? 'Certified organic, recycled and responsibly produced goods.' : lang === 'de' ? 'Zertifizierte Bio-, Recycling- und verantwortungsvoll hergestellte Waren.' : lang === 'it' ? 'Merci biologiche certificate, riciclate e prodotte responsabilmente.' : 'Produits biologiques certifiés, recyclés et produits de manière responsable.' },
    { icon: Users, title: t('about', 'value4'), desc: lang === 'en' ? 'Sharing knowledge and supporting families everywhere.' : lang === 'de' ? 'Wissen teilen und Familien überall unterstützen.' : lang === 'it' ? 'Condividere conoscenze e supportare le famiglie ovunque.' : 'Partager les connaissances et soutenir les familles partout.' },
  ];

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img src="https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="About ogelo" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-forest-900/40 to-transparent flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3">{t('about', 'title')}</h1>
            <p className="text-cream-200 text-lg max-w-xl">{t('about', 'subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">{t('about', 'story')}</h2>
            <p className="text-gray-600 leading-relaxed">{t('about', 'storyText1')}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img src="https://images.pexels.com/photos/3933025/pexels-photo-3933025.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden mt-8">
              <img src="https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-forest-500 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-6">{t('about', 'mission')}</h2>
          <p className="text-forest-100 text-lg leading-relaxed">{t('about', 'missionText')}</p>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="font-serif text-3xl font-bold text-gray-900 text-center mb-14">{t('about', 'values')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-forest-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Icon className="w-6 h-6 text-forest-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream-200 py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">
            {lang === 'en' ? 'Ready to explore?' : lang === 'de' ? 'Bereit zu erkunden?' : lang === 'it' ? 'Pronto ad esplorare?' : 'Prêt à explorer ?'}
          </h2>
          <p className="text-gray-500 mb-8">
            {lang === 'en' ? 'Discover our curated collection of natural toys and clothing.' : lang === 'de' ? 'Entdecken Sie unsere kuratierte Kollektion aus natürlichem Spielzeug und Kleidung.' : lang === 'it' ? 'Scopri la nostra collezione curata di giocattoli naturali e abbigliamento.' : 'Découvrez notre collection sélectionnée de jouets naturels et de vêtements.'}
          </p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-forest-500 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-forest-600 transition-colors">
            {t('home', 'shopNow')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
