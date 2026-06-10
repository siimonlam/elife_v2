import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useSEO } from '../hooks/useSEO';

export default function ShippingPage() {
  const { t, lang } = useLanguage();
  useSEO({ title: t('seo', 'shippingTitle'), lang, canonicalPath: '/shipping' });

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-white border-b border-cream-200 py-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-gray-900">
          {lang === 'en' ? 'Shipping & Returns' : lang === 'de' ? 'Versand & Rückgabe' : lang === 'it' ? 'Spedizione e Resi' : 'Livraison & Retours'}
        </h1>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-6">
        {[
          {
            title: lang === 'en' ? 'Shipping Options' : lang === 'de' ? 'Versandoptionen' : lang === 'it' ? 'Opzioni di spedizione' : 'Options de livraison',
            rows: [
              ['EU Standard (2–5 days)', 'Free over €80 / €5.95 under', '€0–5.95'],
              ['EU Express (1–2 days)', 'Available at checkout', '€9.95'],
              ['International (7–14 days)', 'Available worldwide', 'From €14.95'],
              ['International Express', 'Available at checkout', 'From €24.95'],
            ],
          },
        ].map(({ title, rows }, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">{title}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-cream-200">
                    <th className="pb-3 font-semibold text-gray-700">Service</th>
                    <th className="pb-3 font-semibold text-gray-700">Details</th>
                    <th className="pb-3 font-semibold text-gray-700">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([service, details, cost], j) => (
                    <tr key={j} className="border-b border-cream-100 last:border-0">
                      <td className="py-3 font-medium text-gray-800">{service}</td>
                      <td className="py-3 text-gray-500">{details}</td>
                      <td className="py-3 font-semibold text-forest-600">{cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <div className="bg-white rounded-2xl shadow-sm p-8 prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-gray-800">
          <h2>{lang === 'en' ? 'Returns Policy' : lang === 'de' ? 'Rückgaberichtlinie' : lang === 'it' ? 'Politica di reso' : 'Politique de retour'}</h2>
          <p>{lang === 'en' ? 'We want you to love every ogelo purchase. If you are not completely satisfied, we offer free returns within 30 days of delivery.' : lang === 'de' ? 'Wir möchten, dass Ihnen jeder ogelo-Kauf gefällt. Wenn Sie nicht vollständig zufrieden sind, bieten wir kostenlose Rücksendungen innerhalb von 30 Tagen nach Lieferung an.' : lang === 'it' ? 'Vogliamo che tu ami ogni acquisto ogelo. Se non sei completamente soddisfatto, offriamo resi gratuiti entro 30 giorni dalla consegna.' : 'Nous voulons que vous aimiez chaque achat ogelo. Si vous n\'êtes pas entièrement satisfait, nous offrons des retours gratuits dans les 30 jours suivant la livraison.'}</p>
          <ul>
            <li>{lang === 'en' ? 'Items must be unused and in original packaging' : lang === 'de' ? 'Artikel müssen unbenutzt und in Originalverpackung sein' : lang === 'it' ? 'Gli articoli devono essere non utilizzati e nella confezione originale' : 'Les articles doivent être non utilisés et dans leur emballage d\'origine'}</li>
            <li>{lang === 'en' ? 'Contact hello@wonderkind.com to initiate a return' : lang === 'de' ? 'Kontaktieren Sie hello@wonderkind.com, um eine Rücksendung zu veranlassen' : lang === 'it' ? 'Contatta hello@wonderkind.com per avviare un reso' : 'Contactez hello@wonderkind.com pour initier un retour'}</li>
            <li>{lang === 'en' ? 'Refunds processed within 5–10 business days' : lang === 'de' ? 'Rückerstattungen werden innerhalb von 5–10 Werktagen verarbeitet' : lang === 'it' ? 'I rimborsi vengono elaborati entro 5-10 giorni lavorativi' : 'Les remboursements sont traités dans les 5 à 10 jours ouvrables'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
