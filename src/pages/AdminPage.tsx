import React, { useEffect, useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, BookOpen, MessageSquare, Plus, Edit2, Trash2, Eye, EyeOff, TrendingUp, Users, DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product, Order, BlogPost, Category } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Button } from '../components/ui/Button';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { useSEO } from '../hooks/useSEO';

type AdminTab = 'dashboard' | 'products' | 'orders' | 'blog' | 'messages';

export default function AdminPage() {
  const { t, lang } = useLanguage();
  const { user, profile, loading: authLoading } = useAuth();
  const location = useLocation();
  const [tab, setTab] = useState<AdminTab>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);

  useSEO({ title: t('admin', 'title'), lang });

  useEffect(() => {
    if (authLoading) return;
    if (!profile?.is_admin) { setLoading(false); return; }
    const load = async () => {
      const [pRes, oRes, bRes, mRes, cRes] = await Promise.all([
        supabase.from('products_elife').select('*').order('created_at', { ascending: false }),
        supabase.from('orders_elife').select('*, order_items_elife(*)').order('created_at', { ascending: false }),
        supabase.from('blog_posts_elife').select('*').order('created_at', { ascending: false }),
        supabase.from('contacts_elife').select('*').order('created_at', { ascending: false }),
        supabase.from('categories_elife').select('*').order('sort_order'),
      ]);
      setProducts(pRes.data || []);
      setOrders(oRes.data || []);
      setPosts(bRes.data || []);
      setMessages(mRes.data || []);
      setCategories(cRes.data || []);
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, [profile, authLoading]);

  if (authLoading || loading) return <PageLoader />;
  if (user && profile === null) return <PageLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (!profile?.is_admin) return <Navigate to="/" replace />;

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products_elife').update({ is_active: false }).eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleTogglePublish = async (post: BlogPost) => {
    const newPublished = !post.published;
    const updates = { published: newPublished, published_at: newPublished ? new Date().toISOString() : null };
    const { error } = await supabase.from('blog_posts_elife').update(updates).eq('id', post.id);
    if (!error) setPosts(prev => prev.map(p => p.id === post.id ? { ...p, ...updates } : p));
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    await supabase.from('orders_elife').update({ status }).eq('id', orderId);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as Order['status'] } : o));
  };

  const handleMarkAsRead = async (id: string) => {
    await supabase.from('contacts_elife').update({ read: true }).eq('id', id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSaving(true);
    const payload = {
      ...editingProduct,
      price: Number(editingProduct.price),
      compare_price: editingProduct.compare_price ? Number(editingProduct.compare_price) : null,
      stock: Number(editingProduct.stock || 0),
    };
    if (editingProduct.id) {
      await supabase.from('products_elife').update(payload).eq('id', editingProduct.id);
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...payload } as Product : p));
    } else {
      const { data } = await supabase.from('products_elife').insert(payload).select().single();
      if (data) setProducts(prev => [data, ...prev]);
    }
    setSaving(false);
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const tabs = [
    { id: 'dashboard' as AdminTab, label: t('admin', 'title'), icon: LayoutDashboard },
    { id: 'products' as AdminTab, label: t('admin', 'products'), icon: Package },
    { id: 'orders' as AdminTab, label: t('admin', 'orders'), icon: ShoppingBag },
    { id: 'blog' as AdminTab, label: t('admin', 'blog'), icon: BookOpen },
    { id: 'messages' as AdminTab, label: t('admin', 'contacts'), icon: MessageSquare },
  ];

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-orange-100 text-orange-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-forest-800 text-cream-200 flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-6 border-b border-forest-700">
          <h1 className="font-serif text-lg font-bold text-white">Admin</h1>
          <p className="text-xs text-forest-400 mt-0.5">ogelo CMS</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${tab === id ? 'bg-forest-600 text-white' : 'text-forest-300 hover:bg-forest-700 hover:text-white'}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-forest-700">
            <Link
              to="/admin/seo"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-forest-300 hover:bg-forest-700 hover:text-white"
            >
              <TrendingUp className="w-4 h-4 flex-shrink-0" />
              SEO Manager
            </Link>
          </div>
        </nav>
      </aside>

      {/* Mobile tab bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-cream-200 flex z-30">
        {tabs.map(({ id, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)} className={`flex-1 flex flex-col items-center py-2.5 text-xs ${tab === id ? 'text-forest-600' : 'text-gray-400'}`}>
            <Icon className="w-5 h-5 mb-1" />
          </button>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20 lg:pb-0">
        <div className="p-6 lg:p-8">

          {/* DASHBOARD */}
          {tab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-gray-900">Dashboard</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: DollarSign, label: t('admin', 'totalRevenue'), value: `€${totalRevenue.toFixed(2)}`, color: 'text-green-600 bg-green-50' },
                  { icon: ShoppingBag, label: t('admin', 'totalOrders'), value: orders.length, color: 'text-blue-600 bg-blue-50' },
                  { icon: Package, label: t('admin', 'totalProducts'), value: products.length, color: 'text-forest-600 bg-forest-50' },
                  { icon: MessageSquare, label: t('admin', 'contacts'), value: messages.filter(m => !m.read).length + ' unread', color: 'text-orange-600 bg-orange-50' },
                ].map(({ icon: Icon, label, value, color }, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-xs text-gray-500 mt-1">{label}</p>
                  </div>
                ))}
              </div>

              {/* Recent orders */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-cream-200">
                        <th className="pb-3 font-semibold text-gray-600">{t('admin', 'orderNumber')}</th>
                        <th className="pb-3 font-semibold text-gray-600">{t('admin', 'customer')}</th>
                        <th className="pb-3 font-semibold text-gray-600">{t('admin', 'amount')}</th>
                        <th className="pb-3 font-semibold text-gray-600">{t('admin', 'status')}</th>
                        <th className="pb-3 font-semibold text-gray-600">{t('admin', 'date')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(order => (
                        <tr key={order.id} className="border-b border-cream-100 last:border-0">
                          <td className="py-3 font-mono text-xs text-gray-700">{order.order_number}</td>
                          <td className="py-3">{order.shipping_first_name} {order.shipping_last_name}</td>
                          <td className="py-3 font-semibold">€{order.total.toFixed(2)}</td>
                          <td className="py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>{order.status}</span></td>
                          <td className="py-3 text-gray-400 text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {orders.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">No orders yet.</p>}
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {tab === 'products' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-gray-900">{t('admin', 'products')}</h2>
                <Button onClick={() => { setEditingProduct({ name: { en: '', de: '', it: '', fr: '' }, description: { en: '', de: '', it: '', fr: '' }, slug: '', price: 0, stock: 0, images: [], tags: [], featured: false, is_new: false, is_active: true } as unknown as Product); setShowProductForm(true); }} size="sm">
                  <Plus className="w-4 h-4" /> {t('admin', 'addProduct')}
                </Button>
              </div>

              {showProductForm && editingProduct && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-5">{editingProduct.id ? t('admin', 'editProduct') : t('admin', 'addProduct')}</h3>
                  <form onSubmit={handleSaveProduct} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">Name (EN) *</label>
                        <input type="text" value={(editingProduct.name as Record<string, string>)?.en || ''} onChange={e => setEditingProduct(p => ({ ...p!, name: { ...(p?.name as object), en: e.target.value } }))} required className="w-full px-3 py-2 border border-cream-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-300" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">Name (DE)</label>
                        <input type="text" value={(editingProduct.name as Record<string, string>)?.de || ''} onChange={e => setEditingProduct(p => ({ ...p!, name: { ...(p?.name as object), de: e.target.value } }))} className="w-full px-3 py-2 border border-cream-300 rounded-lg text-sm focus:outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">Name (IT)</label>
                        <input type="text" value={(editingProduct.name as Record<string, string>)?.it || ''} onChange={e => setEditingProduct(p => ({ ...p!, name: { ...(p?.name as object), it: e.target.value } }))} className="w-full px-3 py-2 border border-cream-300 rounded-lg text-sm focus:outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">Name (FR)</label>
                        <input type="text" value={(editingProduct.name as Record<string, string>)?.fr || ''} onChange={e => setEditingProduct(p => ({ ...p!, name: { ...(p?.name as object), fr: e.target.value } }))} className="w-full px-3 py-2 border border-cream-300 rounded-lg text-sm focus:outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Slug *</label>
                      <input type="text" value={editingProduct.slug || ''} onChange={e => setEditingProduct(p => ({ ...p!, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))} required className="w-full px-3 py-2 border border-cream-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-300" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">Price (€) *</label>
                        <input type="number" step="0.01" value={editingProduct.price || ''} onChange={e => setEditingProduct(p => ({ ...p!, price: Number(e.target.value) }))} required className="w-full px-3 py-2 border border-cream-300 rounded-lg text-sm focus:outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">Compare Price</label>
                        <input type="number" step="0.01" value={editingProduct.compare_price || ''} onChange={e => setEditingProduct(p => ({ ...p!, compare_price: Number(e.target.value) }))} className="w-full px-3 py-2 border border-cream-300 rounded-lg text-sm focus:outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">Stock</label>
                        <input type="number" value={editingProduct.stock || 0} onChange={e => setEditingProduct(p => ({ ...p!, stock: Number(e.target.value) }))} className="w-full px-3 py-2 border border-cream-300 rounded-lg text-sm focus:outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">Category</label>
                        <select value={editingProduct.category_id || ''} onChange={e => setEditingProduct(p => ({ ...p!, category_id: e.target.value }))} className="w-full px-3 py-2 border border-cream-300 rounded-lg text-sm focus:outline-none">
                          <option value="">No category</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">Brand</label>
                        <input type="text" value={editingProduct.brand || ''} onChange={e => setEditingProduct(p => ({ ...p!, brand: e.target.value }))} className="w-full px-3 py-2 border border-cream-300 rounded-lg text-sm focus:outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Image URLs (one per line)</label>
                      <textarea rows={3} value={editingProduct.images?.join('\n') || ''} onChange={e => setEditingProduct(p => ({ ...p!, images: e.target.value.split('\n').filter(Boolean) }))} className="w-full px-3 py-2 border border-cream-300 rounded-lg text-sm focus:outline-none resize-none" />
                    </div>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={editingProduct.featured || false} onChange={e => setEditingProduct(p => ({ ...p!, featured: e.target.checked }))} className="rounded" />
                        <span className="text-sm">Featured</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={editingProduct.is_new || false} onChange={e => setEditingProduct(p => ({ ...p!, is_new: e.target.checked }))} className="rounded" />
                        <span className="text-sm">New Arrival</span>
                      </label>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button type="submit" loading={saving}>{t('common', 'save')}</Button>
                      <Button type="button" variant="ghost" onClick={() => { setShowProductForm(false); setEditingProduct(null); }}>{t('common', 'cancel')}</Button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left bg-cream-50 border-b border-cream-200">
                        <th className="px-4 py-3 font-semibold text-gray-600">Product</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">Price</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">{t('admin', 'inventory')}</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => {
                        const name = (p.name as Record<string, string>)['en'] || '';
                        return (
                          <tr key={p.id} className="border-b border-cream-100 last:border-0 hover:bg-cream-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {p.images[0] && <img src={p.images[0]} alt={name} className="w-10 h-10 rounded-lg object-cover" />}
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">{name}</p>
                                  <p className="text-xs text-gray-400">{p.brand}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-semibold text-gray-900">€{p.price.toFixed(2)}</td>
                            <td className="px-4 py-3">
                              <span className={`text-sm font-medium ${p.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>{p.stock}</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1">
                                {p.featured && <span className="bg-terracotta-100 text-terracotta-700 text-xs px-2 py-0.5 rounded-full">Featured</span>}
                                {p.is_new && <span className="bg-forest-100 text-forest-700 text-xs px-2 py-0.5 rounded-full">New</span>}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button onClick={() => { setEditingProduct(p); setShowProductForm(true); }} className="p-1.5 text-gray-400 hover:text-forest-600 transition-colors">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {products.length === 0 && <p className="text-center py-12 text-gray-400">No products found.</p>}
                </div>
              </div>
            </div>
          )}

          {/* ORDERS */}
          {tab === 'orders' && (
            <div className="space-y-5">
              <h2 className="font-serif text-2xl font-bold text-gray-900">{t('admin', 'orders')}</h2>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left bg-cream-50 border-b border-cream-200">
                        <th className="px-4 py-3 font-semibold text-gray-600">{t('admin', 'orderNumber')}</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">{t('admin', 'customer')}</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">{t('admin', 'amount')}</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">{t('admin', 'status')}</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">{t('admin', 'date')}</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id} className="border-b border-cream-100 last:border-0 hover:bg-cream-50">
                          <td className="px-4 py-3 font-mono text-xs">{order.order_number}</td>
                          <td className="px-4 py-3">
                            <p>{order.shipping_first_name} {order.shipping_last_name}</p>
                            <p className="text-xs text-gray-400">{order.shipping_email}</p>
                          </td>
                          <td className="px-4 py-3 font-bold">€{order.total.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <select
                              value={order.status}
                              onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                              className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 focus:outline-none cursor-pointer ${statusColors[order.status] || 'bg-gray-100'}`}
                            >
                              {['pending','confirmed','processing','shipped','delivered','cancelled','refunded'].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-xs text-gray-400">{(order.order_items as any[])?.length || 0} items</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {orders.length === 0 && <p className="text-center py-12 text-gray-400">No orders yet.</p>}
                </div>
              </div>
            </div>
          )}

          {/* BLOG */}
          {tab === 'blog' && (
            <div className="space-y-5">
              <h2 className="font-serif text-2xl font-bold text-gray-900">{t('admin', 'blog')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts.map(post => {
                  const title = (post.title as Record<string, string>)['en'] || '';
                  return (
                    <div key={post.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                      {post.cover_image && (
                        <div className="aspect-video overflow-hidden">
                          <img src={post.cover_image} alt={title} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">{title}</h3>
                        <p className="text-xs text-gray-400 mb-3">{post.author}</p>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {post.published ? t('admin', 'published') : t('admin', 'draft')}
                          </span>
                          <button
                            onClick={() => handleTogglePublish(post)}
                            className="flex items-center gap-1.5 text-xs text-forest-600 font-medium hover:text-forest-700 transition-colors"
                          >
                            {post.published ? <><EyeOff className="w-3.5 h-3.5" /> {t('admin', 'unpublish')}</> : <><Eye className="w-3.5 h-3.5" /> {t('admin', 'publish')}</>}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {posts.length === 0 && <p className="text-center py-12 text-gray-400">No blog posts yet.</p>}
            </div>
          )}

          {/* MESSAGES */}
          {tab === 'messages' && (
            <div className="space-y-5">
              <h2 className="font-serif text-2xl font-bold text-gray-900">{t('admin', 'contacts')}</h2>
              <div className="space-y-3">
                {messages.map(msg => (
                  <div key={msg.id} className={`bg-white rounded-2xl shadow-sm p-5 ${!msg.read ? 'border-l-4 border-forest-400' : 'border-l-4 border-transparent'}`}>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{msg.name}</p>
                        <p className="text-xs text-gray-400">{msg.email}</p>
                      </div>
                      <div className="text-right flex-shrink-0 flex flex-col items-end gap-1">
                        <p className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleDateString()}</p>
                        {!msg.read ? (
                          <button
                            onClick={() => handleMarkAsRead(msg.id)}
                            className="text-xs bg-forest-100 text-forest-700 px-2 py-0.5 rounded-full font-medium hover:bg-forest-200 transition-colors"
                          >
                            Mark as read
                          </button>
                        ) : (
                          <span className="text-xs text-gray-300">Read</span>
                        )}
                      </div>
                    </div>
                    {msg.subject && <p className="text-xs font-semibold text-gray-600 mb-1">{msg.subject}</p>}
                    <p className="text-sm text-gray-600 leading-relaxed">{msg.message}</p>
                  </div>
                ))}
                {messages.length === 0 && <p className="text-center py-12 text-gray-400">No messages yet.</p>}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
