'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductById } from '@/data/products';

function categoryEmoji(category: string) {
  const map: Record<string, string> = { gaming: '🎮', anime: '⛩️', tech: '🔧', collectibles: '📦' };
  return map[category] || '🛒';
}

export default function ProductDetailClient({ id }: { id: string }) {
  const product = getProductById(id);
  if (!product) notFound();

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item: { id: string }) => item.id === product.id);
    if (existing) { existing.qty += qty; } else {
      cart.push({ id: product.id, name: product.name, price: product.price, qty });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));

  return (
    <div className="container" style={{ padding: '48px 24px' }}>
      <nav data-testid="breadcrumb" style={{ marginBottom: '32px', fontSize: '13px', color: 'var(--text-muted)' }}>
        <Link href="/">Home</Link>{' / '}
        <Link href="/products">Catalog</Link>{' / '}
        <span style={{ color: 'var(--text-secondary)' }}>{product.name}</span>
      </nav>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
        <div data-testid="product-detail-image" style={{ background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-card-hover))', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '120px' }}>
          {categoryEmoji(product.category)}
        </div>
        <div>
          <p style={{ fontSize: '12px', letterSpacing: '0.15em', color: 'var(--accent-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>{product.category}</p>
          <h1 data-testid="product-detail-name" style={{ fontFamily: 'var(--font-display)', fontSize: '28px', marginBottom: '16px', lineHeight: 1.3 }}>{product.name}</h1>
          <div data-testid="product-detail-rating" style={{ marginBottom: '16px' }}>
            <span className="stars">{stars}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px', marginLeft: 8 }}>{product.rating} / 5.0</span>
          </div>
          <div data-testid="product-detail-price" style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 900, color: 'var(--accent-primary)', marginBottom: '24px' }}>${product.price.toFixed(2)}</div>
          <p data-testid="product-detail-description" style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '32px' }}>{product.description}</p>
          <p data-testid="product-detail-stock" style={{ marginBottom: '24px', fontSize: '14px', color: product.stock === 0 ? 'var(--accent-hot)' : product.stock < 5 ? '#ffaa00' : 'var(--accent-primary)' }}>
            {product.stock === 0 ? '✗ Out of stock' : product.stock < 5 ? `⚠ Only ${product.stock} left in stock` : `✓ ${product.stock} in stock`}
          </p>
          {product.stock > 0 && (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button data-testid="qty-decrease" onClick={() => setQty(Math.max(1, qty - 1))} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '16px' }}>−</button>
                <span data-testid="qty-value" style={{ fontFamily: 'var(--font-display)', fontSize: '18px', minWidth: '32px', textAlign: 'center' }}>{qty}</span>
                <button data-testid="qty-increase" onClick={() => setQty(Math.min(product.stock, qty + 1))} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '16px' }}>+</button>
              </div>
              <button data-testid="add-to-cart-btn" onClick={addToCart} className="btn btn-primary" style={{ flex: 1 }}>{added ? '✓ Added!' : 'Add to Cart'}</button>
            </div>
          )}
          <Link href="/products" style={{ color: 'var(--text-muted)', fontSize: '13px' }}>← Back to Catalog</Link>
        </div>
      </div>
    </div>
  );
}
