'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  const updateCart = (updated: CartItem[]) => {
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const updateQty = (id: string, newQty: number) => {
    if (newQty < 1) return;
    updateCart(cart.map((item) => item.id === id ? { ...item, qty: newQty } : item));
  };

  const removeItem = (id: string) => {
    updateCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => updateCart([]);

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  if (!mounted) return <div className="loading">Loading cart...</div>;

  return (
    <div className="container" style={{ padding: '48px 24px' }}>
      <h1 data-testid="cart-title" style={{
        fontFamily: 'var(--font-display)',
        fontSize: '32px',
        marginBottom: '32px'
      }}>
        <span style={{ color: 'var(--accent-primary)' }}>// </span>YOUR CART
      </h1>

      {cart.length === 0 ? (
        <div data-testid="cart-empty" style={{
          textAlign: 'center',
          padding: '80px',
          color: 'var(--text-muted)'
        }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '24px' }}>
            Your cart is empty
          </p>
          <Link href="/products" className="btn btn-primary">
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px', alignItems: 'start' }}>
          {/* Items */}
          <div data-testid="cart-items" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.map((item) => (
              <div
                key={item.id}
                data-testid={`cart-item-${item.id}`}
                className="card"
                style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}
              >
                <div style={{ flex: 1 }}>
                  <p data-testid={`cart-item-name-${item.id}`} style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '14px',
                    marginBottom: '4px'
                  }}>
                    {item.name}
                  </p>
                  <p data-testid={`cart-item-price-${item.id}`} style={{
                    color: 'var(--accent-primary)',
                    fontSize: '16px',
                    fontWeight: 700
                  }}>
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                {/* Qty controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    data-testid={`cart-decrease-${item.id}`}
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="btn btn-secondary"
                    style={{ padding: '4px 12px' }}
                  >−</button>
                  <span data-testid={`cart-qty-${item.id}`} style={{
                    fontFamily: 'var(--font-display)',
                    minWidth: '24px',
                    textAlign: 'center'
                  }}>
                    {item.qty}
                  </span>
                  <button
                    data-testid={`cart-increase-${item.id}`}
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="btn btn-secondary"
                    style={{ padding: '4px 12px' }}
                  >+</button>
                </div>

                <p data-testid={`cart-subtotal-${item.id}`} style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '16px',
                  minWidth: '80px',
                  textAlign: 'right'
                }}>
                  ${(item.price * item.qty).toFixed(2)}
                </p>

                <button
                  data-testid={`cart-remove-${item.id}`}
                  onClick={() => removeItem(item.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-hot)',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >✕</button>
              </div>
            ))}

            <button
              data-testid="clear-cart-btn"
              onClick={clearCart}
              className="btn btn-secondary"
              style={{ alignSelf: 'flex-start', color: 'var(--accent-hot)', borderColor: 'var(--accent-hot)' }}
            >
              Clear Cart
            </button>
          </div>

          {/* Summary */}
          <div data-testid="cart-summary" className="card" style={{ padding: '24px', position: 'sticky', top: '80px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '24px' }}>
              ORDER SUMMARY
            </h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Items ({cart.length})</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
              <span style={{ color: 'var(--accent-primary)' }}>FREE</span>
            </div>

            <div className="glow-line" style={{ margin: '16px 0' }} />

            <div data-testid="cart-total" style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              fontWeight: 700,
              marginBottom: '24px'
            }}>
              <span>TOTAL</span>
              <span style={{ color: 'var(--accent-primary)' }}>${total.toFixed(2)}</span>
            </div>

            <button data-testid="checkout-btn" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
