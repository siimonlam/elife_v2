import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useSEO } from '../hooks/useSEO';

export default function PrivacyPage() {
  const { t, lang } = useLanguage();
  useSEO({ title: t('seo', 'privacyTitle'), lang, canonicalPath: '/privacy' });

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-white border-b border-cream-200 py-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-gray-900">
          {lang === 'en' ? 'Privacy Policy' : lang === 'de' ? 'Datenschutzerklärung' : lang === 'it' ? 'Informativa sulla Privacy' : 'Politique de Confidentialité'}
        </h1>
        <p className="text-gray-400 text-sm mt-2">Last updated: January 2024</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12 prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-gray-800">
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide when creating an account, placing an order or contacting us. This includes your name, email address, shipping address, and payment information (processed securely by our payment partners).</p>
          <h2>2. How We Use Your Information</h2>
          <p>We use your information to process orders, send order confirmations and shipping updates, provide customer support, and improve our products and services. We may send marketing communications if you have opted in.</p>
          <h2>3. Data Storage and Security</h2>
          <p>Your data is stored securely using industry-standard encryption. We use Supabase for data storage, which complies with GDPR requirements. Payment information is never stored on our servers.</p>
          <h2>4. Cookies</h2>
          <p>We use essential cookies to operate the website (session management, shopping cart). We also use analytics cookies (with your consent) to understand how visitors use our site. You can manage cookie preferences in your browser settings.</p>
          <h2>5. Third-Party Services</h2>
          <p>We work with trusted third-party service providers including payment processors and shipping partners. These providers have their own privacy policies and we encourage you to review them.</p>
          <h2>6. Your Rights (GDPR)</h2>
          <p>Under GDPR, you have the right to access, correct, delete or export your personal data. You also have the right to restrict or object to processing. To exercise these rights, contact us at hello@wonderkind.com.</p>
          <h2>7. Data Retention</h2>
          <p>We retain your account data for as long as your account is active or as required by law. Order history is retained for 7 years for tax purposes. You may request deletion of your account at any time.</p>
          <h2>8. Children's Privacy</h2>
          <p>Our website is intended for use by adults. We do not knowingly collect personal information from children under 16. If you believe a child has provided us with personal information, please contact us immediately.</p>
          <h2>9. Contact</h2>
          <p>For privacy-related questions or to exercise your rights, contact our Data Protection Officer at privacy@wonderkind.com or Musterstraße 12, 10115 Berlin, Germany.</p>
        </div>
      </div>
    </div>
  );
}
