import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useSEO } from '../hooks/useSEO';

interface FAQItem { q: string; a: string; }

export default function FAQPage() {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState<number | null>(null);

  useSEO({ title: t('seo', 'faqTitle'), description: t('seo', 'faqDescription'), lang, canonicalPath: '/faq' });

  const faqs: Record<string, FAQItem[]> = {
    en: [
      { q: 'Do you ship worldwide?', a: 'Yes! We ship to over 60 countries worldwide. Free standard shipping on all orders over €80 within the EU. International rates vary by destination.' },
      { q: 'How long does delivery take?', a: 'EU orders arrive in 2–5 business days. International orders typically take 7–14 business days. Express options are available at checkout.' },
      { q: 'What is your return policy?', a: 'We offer free returns within 30 days of delivery for unused items in their original packaging. Simply contact our team to initiate a return.' },
      { q: 'Are all products safe for children?', a: 'Absolutely. Every product we carry meets EU CE safety standards. Many carry additional certifications including GOTS (organic textiles), FSC (sustainable wood), and EN71 (toy safety).' },
      { q: 'Do you offer gift wrapping?', a: 'Yes! We offer beautiful eco-friendly gift wrapping for €4.50 per order. You can add a personalised message at checkout.' },
      { q: 'Can I change or cancel my order?', a: 'Orders can be changed or cancelled within 1 hour of placement. Please contact us immediately at hello@wonderkind.com.' },
      { q: 'What payment methods do you accept?', a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex), PayPal, and bank transfer. All transactions are SSL encrypted.' },
      { q: 'Do you have a loyalty programme?', a: 'Yes! Every purchase earns ogelo points. Redeem them for discounts on future orders. Sign up for a free account to start earning.' },
    ],
    de: [
      { q: 'Versenden Sie weltweit?', a: 'Ja! Wir versenden in über 60 Länder weltweit. Kostenloser Standardversand für alle Bestellungen über 80€ innerhalb der EU.' },
      { q: 'Wie lange dauert die Lieferung?', a: 'EU-Bestellungen kommen in 2–5 Werktagen an. Internationale Bestellungen dauern typischerweise 7–14 Werktage.' },
      { q: 'Was ist Ihre Rückgaberichtlinie?', a: 'Wir bieten kostenlose Rücksendungen innerhalb von 30 Tagen nach Lieferung für unbenutzte Artikel in Originalverpackung.' },
      { q: 'Sind alle Produkte für Kinder sicher?', a: 'Absolut. Jedes Produkt erfüllt EU CE-Sicherheitsstandards. Viele tragen zusätzliche Zertifizierungen wie GOTS, FSC und EN71.' },
      { q: 'Bieten Sie Geschenkverpackung an?', a: 'Ja! Wir bieten wunderschöne umweltfreundliche Geschenkverpackung für 4,50€ pro Bestellung an.' },
      { q: 'Kann ich meine Bestellung ändern oder stornieren?', a: 'Bestellungen können innerhalb von 1 Stunde nach der Aufgabe geändert oder storniert werden.' },
      { q: 'Welche Zahlungsmethoden akzeptieren Sie?', a: 'Wir akzeptieren alle gängigen Kredit- und Debitkarten, PayPal und Banküberweisung.' },
      { q: 'Haben Sie ein Treueprogramm?', a: 'Ja! Jeder Einkauf bringt ogelo-Punkte. Lösen Sie diese für Rabatte auf zukünftige Bestellungen ein.' },
    ],
    it: [
      { q: 'Spedite in tutto il mondo?', a: 'Sì! Spediamo in oltre 60 paesi nel mondo. Spedizione standard gratuita per ordini superiori a €80 nell\'UE.' },
      { q: 'Quanto tempo richiede la consegna?', a: 'Gli ordini UE arrivano in 2-5 giorni lavorativi. Gli ordini internazionali richiedono tipicamente 7-14 giorni lavorativi.' },
      { q: 'Qual è la vostra politica di reso?', a: 'Offriamo resi gratuiti entro 30 giorni dalla consegna per articoli non utilizzati nella confezione originale.' },
      { q: 'Tutti i prodotti sono sicuri per i bambini?', a: 'Assolutamente. Ogni prodotto che vendiamo soddisfa gli standard di sicurezza EU CE.' },
      { q: 'Offrite confezioni regalo?', a: 'Sì! Offriamo bellissime confezioni regalo ecologiche per €4,50 per ordine.' },
      { q: 'Posso modificare o annullare il mio ordine?', a: 'Gli ordini possono essere modificati o annullati entro 1 ora dall\'inserimento.' },
      { q: 'Quali metodi di pagamento accettate?', a: 'Accettiamo tutte le principali carte di credito e debito, PayPal e bonifico bancario.' },
      { q: 'Avete un programma fedeltà?', a: 'Sì! Ogni acquisto guadagna punti ogelo riscattabili per sconti futuri.' },
    ],
    fr: [
      { q: 'Livrez-vous dans le monde entier?', a: 'Oui! Nous livrons dans plus de 60 pays. Livraison standard gratuite pour toutes les commandes supérieures à 80€ dans l\'UE.' },
      { q: 'Combien de temps prend la livraison?', a: 'Les commandes UE arrivent en 2 à 5 jours ouvrables. Les commandes internationales prennent généralement 7 à 14 jours ouvrables.' },
      { q: 'Quelle est votre politique de retour?', a: 'Nous offrons des retours gratuits dans les 30 jours suivant la livraison pour les articles non utilisés dans leur emballage d\'origine.' },
      { q: 'Tous les produits sont-ils sûrs pour les enfants?', a: 'Absolument. Chaque produit que nous vendons répond aux normes de sécurité européennes CE.' },
      { q: 'Proposez-vous un emballage cadeau?', a: 'Oui! Nous proposons de beaux emballages cadeaux écologiques pour 4,50€ par commande.' },
      { q: 'Puis-je modifier ou annuler ma commande?', a: 'Les commandes peuvent être modifiées ou annulées dans l\'heure suivant leur passation.' },
      { q: 'Quels modes de paiement acceptez-vous?', a: 'Nous acceptons toutes les principales cartes de crédit et de débit, PayPal et virement bancaire.' },
      { q: 'Avez-vous un programme de fidélité?', a: 'Oui! Chaque achat rapporte des points ogelo échangeables contre des réductions futures.' },
    ],
  };

  const items = faqs[lang] || faqs['en'];

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-white border-b border-cream-200 py-14 text-center">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-3">{t('faq', 'title')}</h1>
        <p className="text-gray-500 max-w-xl mx-auto">{t('faq', 'subtitle')}</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-cream-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 text-sm pr-4">{item.q}</span>
                {open === i ? (
                  <ChevronUp className="w-5 h-5 text-forest-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-gray-600 leading-relaxed border-t border-cream-100 pt-4">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-forest-50 rounded-2xl p-8 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">
            {lang === 'en' ? 'Still have questions?' : lang === 'de' ? 'Noch Fragen?' : lang === 'it' ? 'Hai ancora domande?' : 'Encore des questions?'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {lang === 'en' ? 'Our team is happy to help.' : lang === 'de' ? 'Unser Team hilft Ihnen gerne weiter.' : lang === 'it' ? 'Il nostro team è felice di aiutarti.' : 'Notre équipe est heureuse de vous aider.'}
          </p>
          <a href="mailto:hello@wonderkind.com" className="inline-flex items-center gap-2 bg-forest-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-forest-600 transition-colors">
            hello@wonderkind.com
          </a>
        </div>
      </div>
    </div>
  );
}
