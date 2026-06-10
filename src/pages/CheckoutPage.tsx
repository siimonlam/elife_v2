import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, ChevronDown, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Button } from '../components/ui/Button';
import { useSEO } from '../hooks/useSEO';
import type { CheckoutFormData } from '../types';

const COUNTRIES = [
  { code: 'DE', name: 'Germany' }, { code: 'AT', name: 'Austria' }, { code: 'CH', name: 'Switzerland' },
  { code: 'IT', name: 'Italy' }, { code: 'FR', name: 'France' }, { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' }, { code: 'CA', name: 'Canada' }, { code: 'AU', name: 'Australia' },
];

const emptyForm: CheckoutFormData = {
  email: '', firstName: '', lastName: '', phone: '',
  line1: '', line2: '', city: '', state: '', postalCode: '', country: 'DE',
  paymentMethod: 'card', cardNumber: '', cardExpiry: '', cardCvc: '', cardName: '',
};

export default function CheckoutPage() {
  const { t, lang } = useLanguage();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<CheckoutFormData>({ ...emptyForm, email: user?.email || '' });
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});

  useSEO({ title: t('seo', 'checkoutTitle'), lang, canonicalPath: '/checkout' });

  const shippingCost = subtotal >= 80 ? 0 : subtotal > 0 ? 5.95 : 0;
  const tax = (subtotal + shippingCost) * 0.20;
  const total = subtotal + shippingCost + tax;

  const set = (key: keyof CheckoutFormData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof CheckoutFormData, string>> = {};
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.line1.trim()) e.line1 = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.postalCode.trim()) e.postalCode = 'Required';
    if (form.paymentMethod === 'card') {
      if (form.cardNumber.replace(/\s/g, '').length < 14) e.cardNumber = 'Invalid card number';
      if (!form.cardExpiry.match(/^\d{2}\/\d{2}$/)) e.cardExpiry = 'Use MM/YY format';
      if (form.cardCvc.length < 3) e.cardCvc = 'Invalid CVC';
      if (!form.cardName.trim()) e.cardName = 'Required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const orderPayload = {
        user_id: user?.id ?? null,
        status: 'confirmed',
        subtotal,
        shipping_cost: shippingCost,
        tax,
        total,
        currency: 'EUR',
        shipping_first_name: form.firstName,
        shipping_last_name: form.lastName,
        shipping_email: form.email,
        shipping_phone: form.phone,
        shipping_line1: form.line1,
        shipping_line2: form.line2,
        shipping_city: form.city,
        shipping_state: form.state,
        shipping_postal_code: form.postalCode,
        shipping_country: form.country,
        payment_method: form.paymentMethod,
        payment_status: 'paid',
      };
      const { data: order, error } = await supabase.from('orders_elife').insert(orderPayload).select().single();
      if (error) throw error;

      await supabase.from('order_items_elife').insert(
        items.map(item => ({
          order_id: order.id,
          product_id: item.productId,
          product_name: (item.name as Record<string, string>)['en'] || '',
          product_image: item.image,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
        }))
      );

      clearCart();
      setStep('success');
    } catch {
      setErrors({ email: 'Order failed. Please try again.' });
    }
    setLoading(false);
  };

  if (items.length === 0 && step !== 'success') {
    navigate('/cart');
    return null;
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-lg p-10 max-w-md w-full text-center space-y-5">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-gray-900">{t('checkout', 'success')}</h2>
          <p className="text-gray-500 leading-relaxed">{t('checkout', 'successMessage')}</p>
          <Button onClick={() => navigate('/')} fullWidth size="lg">{t('common', 'backHome')}</Button>
        </div>
      </div>
    );
  }

  const Field = ({ label, id, required = false, error, children }: { label: string; id: string; required?: boolean; error?: string; children: React.ReactNode }) => (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );

  const inputCls = (error?: string) => `w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-300 ${error ? 'border-red-300 bg-red-50' : 'border-cream-300 bg-white'}`;

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="text-xs text-gray-400 mb-8 flex items-center gap-1">
          <Link to="/" className="hover:text-forest-600">Home</Link>
          <span>/</span>
          <Link to="/cart" className="hover:text-forest-600">{t('cart', 'title')}</Link>
          <span>/</span>
          <span className="text-gray-700">{t('checkout', 'title')}</span>
        </nav>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left: form */}
            <div className="lg:col-span-3 space-y-8">
              <Link to="/" className="flex items-center mb-2">
                <img src="/ogelo-logo.jpg" alt="ogelo" className="h-8 w-auto" />
              </Link>

              {/* Contact */}
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 bg-forest-500 text-white text-xs font-bold rounded-full flex items-center justify-center">1</span>
                  {t('checkout', 'contact')}
                </h2>
                <Field label={t('checkout', 'email')} id="email" required error={errors.email}>
                  <input id="email" type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputCls(errors.email)} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label={t('checkout', 'firstName')} id="firstName" required error={errors.firstName}>
                    <input id="firstName" type="text" value={form.firstName} onChange={e => set('firstName', e.target.value)} className={inputCls(errors.firstName)} />
                  </Field>
                  <Field label={t('checkout', 'lastName')} id="lastName" required error={errors.lastName}>
                    <input id="lastName" type="text" value={form.lastName} onChange={e => set('lastName', e.target.value)} className={inputCls(errors.lastName)} />
                  </Field>
                </div>
                <Field label={t('checkout', 'phone')} id="phone">
                  <input id="phone" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className={inputCls()} />
                </Field>
              </div>

              {/* Shipping */}
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 bg-forest-500 text-white text-xs font-bold rounded-full flex items-center justify-center">2</span>
                  {t('checkout', 'shipping')}
                </h2>
                <Field label={t('checkout', 'address')} id="line1" required error={errors.line1}>
                  <input id="line1" type="text" value={form.line1} onChange={e => set('line1', e.target.value)} className={inputCls(errors.line1)} />
                </Field>
                <Field label={t('checkout', 'address2')} id="line2">
                  <input id="line2" type="text" value={form.line2} onChange={e => set('line2', e.target.value)} className={inputCls()} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label={t('checkout', 'city')} id="city" required error={errors.city}>
                    <input id="city" type="text" value={form.city} onChange={e => set('city', e.target.value)} className={inputCls(errors.city)} />
                  </Field>
                  <Field label={t('checkout', 'postalCode')} id="postalCode" required error={errors.postalCode}>
                    <input id="postalCode" type="text" value={form.postalCode} onChange={e => set('postalCode', e.target.value)} className={inputCls(errors.postalCode)} />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label={t('checkout', 'state')} id="state">
                    <input id="state" type="text" value={form.state} onChange={e => set('state', e.target.value)} className={inputCls()} />
                  </Field>
                  <Field label={t('checkout', 'country')} id="country" required>
                    <select id="country" value={form.country} onChange={e => set('country', e.target.value)} className={inputCls()}>
                      {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                  </Field>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 bg-forest-500 text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
                  {t('checkout', 'payment')}
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'card', label: t('checkout', 'creditCard'), icon: '💳' },
                    { value: 'paypal', label: 'PayPal', icon: '🅿' },
                  ].map(method => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => set('paymentMethod', method.value)}
                      className={`border-2 rounded-xl p-3 flex items-center gap-2 text-sm font-medium transition-colors ${form.paymentMethod === method.value ? 'border-forest-500 bg-forest-50 text-forest-700' : 'border-cream-300 text-gray-700 hover:border-forest-300'}`}
                    >
                      <span>{method.icon}</span>
                      {method.label}
                    </button>
                  ))}
                </div>

                {form.paymentMethod === 'card' && (
                  <div className="space-y-3 pt-1">
                    <Field label={t('checkout', 'cardName')} id="cardName" required error={errors.cardName}>
                      <input id="cardName" type="text" value={form.cardName} onChange={e => set('cardName', e.target.value)} placeholder="Name as on card" className={inputCls(errors.cardName)} />
                    </Field>
                    <Field label={t('checkout', 'cardNumber')} id="cardNumber" required error={errors.cardNumber}>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input id="cardNumber" type="text" value={form.cardNumber} onChange={e => set('cardNumber', e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19))} placeholder="0000 0000 0000 0000" maxLength={19} className={`${inputCls(errors.cardNumber)} pl-10`} />
                      </div>
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label={t('checkout', 'cardExpiry')} id="cardExpiry" required error={errors.cardExpiry}>
                        <input id="cardExpiry" type="text" value={form.cardExpiry} onChange={e => { const v = e.target.value.replace(/\D/g, ''); set('cardExpiry', v.length >= 2 ? `${v.slice(0, 2)}/${v.slice(2, 4)}` : v); }} placeholder="MM/YY" maxLength={5} className={inputCls(errors.cardExpiry)} />
                      </Field>
                      <Field label={t('checkout', 'cardCvc')} id="cardCvc" required error={errors.cardCvc}>
                        <input id="cardCvc" type="text" value={form.cardCvc} onChange={e => set('cardCvc', e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="CVC" maxLength={4} className={inputCls(errors.cardCvc)} />
                      </Field>
                    </div>
                  </div>
                )}

                {form.paymentMethod === 'paypal' && (
                  <div className="bg-cream-100 rounded-xl p-4 text-sm text-gray-600 text-center">
                    You will be redirected to PayPal to complete your payment.
                  </div>
                )}
              </div>

              <Button type="submit" fullWidth size="lg" loading={loading}>
                {loading ? t('checkout', 'processing') : `${t('checkout', 'placeOrder')} — €${total.toFixed(2)}`}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4" />
                {t('checkout', 'secureCheckout')}
              </div>
            </div>

            {/* Right: Order summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24 space-y-4">
                <h2 className="font-semibold text-gray-900">{t('checkout', 'orderSummary')}</h2>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {items.map(item => {
                    const name = (item.name as Record<string, string>)[lang] || item.name['en'];
                    return (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-cream-100 flex-shrink-0">
                          <img src={item.image} alt={name} className="w-full h-full object-cover" />
                          <span className="absolute -top-1 -right-1 bg-forest-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{item.quantity}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 leading-snug truncate">{name}</p>
                          <p className="text-sm font-bold text-gray-900">€{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-cream-200 pt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>{t('cart', 'subtotal')}</span>
                    <span className="font-semibold text-gray-900">€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('cart', 'shipping')}</span>
                    <span className="font-semibold text-gray-900">{shippingCost === 0 ? 'Free' : `€${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('cart', 'tax')}</span>
                    <span className="font-semibold text-gray-900">€{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t border-cream-200">
                    <span>{t('cart', 'total')}</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
