import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useSEO } from '../hooks/useSEO';

export default function TermsPage() {
  const { t, lang } = useLanguage();
  useSEO({ title: t('seo', 'termsTitle'), lang, canonicalPath: '/terms' });

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-white border-b border-cream-200 py-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-gray-900">
          {lang === 'en' ? 'Terms & Conditions' : lang === 'de' ? 'Allgemeine Geschäftsbedingungen' : lang === 'it' ? 'Termini e Condizioni' : 'Conditions Générales de Vente'}
        </h1>
        <p className="text-gray-400 text-sm mt-2">Last updated: January 2024</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12 prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-gray-800">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using the ogelo website and purchasing our products, you agree to be bound by these Terms and Conditions. Please read them carefully before placing an order.</p>
          <h2>2. Products and Pricing</h2>
          <p>All prices are shown in Euros (€) and include VAT where applicable. We reserve the right to change prices at any time without notice. Product images are for illustrative purposes; actual products may vary slightly.</p>
          <h2>3. Orders and Payment</h2>
          <p>Orders are accepted subject to availability. We reserve the right to decline any order. Payment is processed securely via our payment partners. We accept Visa, Mastercard, American Express and PayPal.</p>
          <h2>4. Shipping and Delivery</h2>
          <p>We aim to dispatch all orders within 1–2 business days. EU orders typically arrive within 2–5 business days. International orders take 7–14 business days. Free standard shipping is available on EU orders over €80.</p>
          <h2>5. Returns and Refunds</h2>
          <p>You have the right to return unused items in their original packaging within 30 days of delivery. To initiate a return, please contact us at hello@wonderkind.com. Refunds are processed within 5–10 business days.</p>
          <h2>6. Intellectual Property</h2>
          <p>All content on this website including text, images, logos and design is the property of ogelo and is protected by copyright law. You may not reproduce or use any content without our express written permission.</p>
          <h2>7. Limitation of Liability</h2>
          <p>ogelo's liability is limited to the value of the products purchased. We are not liable for indirect or consequential damages arising from the use of our products or website.</p>
          <h2>8. Governing Law</h2>
          <p>These terms are governed by the laws of Germany. Any disputes shall be subject to the exclusive jurisdiction of the courts of Berlin, Germany.</p>
          <h2>9. Contact</h2>
          <p>For questions about these terms, please contact us at hello@wonderkind.com or Musterstraße 12, 10115 Berlin, Germany.</p>
        </div>
      </div>
    </div>
  );
}
