import React, { Component } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SEOProvider } from './context/SEOContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

class ErrorBoundary extends Component<{ children: React.ReactNode; label?: string }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-cream-100">
          <div className="max-w-lg w-full bg-white rounded-2xl shadow p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{this.props.label ?? 'Something went wrong'}</h1>
            <p className="text-sm text-red-600 font-mono bg-red-50 rounded-lg p-4 text-left break-all">
              {(this.state.error as Error).message}
            </p>
            <button onClick={() => window.location.href = '/'} className="mt-6 bg-forest-500 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-forest-600">
              Back to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import SEOAdminPage from './pages/SEOAdminPage';
import SetupPage from './pages/SetupPage';
import FAQPage from './pages/FAQPage';
import ShippingPage from './pages/ShippingPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-serif text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-500 mb-6">The page you are looking for does not exist.</p>
        <a href="/" className="bg-forest-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-forest-600 transition-colors inline-block">Back to Home</a>
      </div>
    </div>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <SEOProvider>
              <Routes>
                {/* Auth pages (no header/footer) */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Admin pages — each wrapped in its own error boundary */}
                <Route path="/setup" element={<ErrorBoundary label="Setup Error"><SetupPage /></ErrorBoundary>} />
                <Route path="/setup/" element={<Navigate to="/setup" replace />} />
                <Route path="/admin" element={<ErrorBoundary label="Admin Error"><AdminPage /></ErrorBoundary>} />
                <Route path="/admin/" element={<Navigate to="/admin" replace />} />
                <Route path="/admin/seo" element={<ErrorBoundary label="SEO Manager Error"><SEOAdminPage /></ErrorBoundary>} />
                <Route path="/admin/seo/" element={<Navigate to="/admin/seo" replace />} />

                {/* Main site */}
                <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
                <Route path="/products" element={<AppLayout><ProductsPage /></AppLayout>} />
                <Route path="/products/:slug" element={<AppLayout><ProductDetailPage /></AppLayout>} />
                <Route path="/cart" element={<AppLayout><CartPage /></AppLayout>} />
                <Route path="/checkout" element={<AppLayout><CheckoutPage /></AppLayout>} />
                <Route path="/blog" element={<AppLayout><BlogPage /></AppLayout>} />
                <Route path="/blog/:slug" element={<AppLayout><BlogDetailPage /></AppLayout>} />
                <Route path="/about" element={<AppLayout><AboutPage /></AppLayout>} />
                <Route path="/contact" element={<AppLayout><ContactPage /></AppLayout>} />
                <Route path="/faq" element={<AppLayout><FAQPage /></AppLayout>} />
                <Route path="/shipping" element={<AppLayout><ShippingPage /></AppLayout>} />
                <Route path="/privacy" element={<AppLayout><PrivacyPage /></AppLayout>} />
                <Route path="/terms" element={<AppLayout><TermsPage /></AppLayout>} />
                <Route path="*" element={<AppLayout><NotFoundPage /></AppLayout>} />
              </Routes>
            </SEOProvider>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
    </ErrorBoundary>
  );
}
