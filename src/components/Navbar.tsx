'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((acc: number, item: { qty: number }) => acc + item.qty, 0));
    };

    const updateUser = () => {
      const stored = localStorage.getItem('user');
      setUser(stored ? JSON.parse(stored).name : null);
    };

    updateCart();
    updateUser();
    window.addEventListener('cartUpdated', updateCart);
    window.addEventListener('userUpdated', updateUser);
    return () => {
      window.removeEventListener('cartUpdated', updateCart);
      window.removeEventListener('userUpdated', updateUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userUpdated'));
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Catalog' }
  ];

  return (
    <nav data-testid="navbar" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(10, 10, 15, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64
      }}>
        {/* Logo */}
        <Link href="/" data-testid="nav-logo" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '20px',
          fontWeight: 900,
          color: 'var(--accent-primary)',
          letterSpacing: '0.1em',
          textDecoration: 'none'
        }}>
          GEEK<span style={{ color: 'var(--accent-secondary)' }}>STORE</span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: '32px' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-testid={`nav-${link.label.toLowerCase()}`}
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '15px',
                letterSpacing: '0.08em',
                color: pathname === link.href
                  ? 'var(--accent-primary)'
                  : 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <>
              <span data-testid="nav-username" style={{
                color: 'var(--text-secondary)',
                fontSize: '14px'
              }}>
                Hey, {user}
              </span>
              <button
                data-testid="nav-logout"
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '6px 16px', fontSize: '13px' }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              data-testid="nav-login"
              className="btn btn-secondary"
              style={{ padding: '6px 16px', fontSize: '13px' }}
            >
              Login
            </Link>
          )}

          <Link
            href="/cart"
            data-testid="nav-cart"
            style={{
              position: 'relative',
              color: 'var(--text-primary)',
              fontSize: '20px',
              textDecoration: 'none'
            }}
          >
            🛒
            {cartCount > 0 && (
              <span data-testid="cart-count" style={{
                position: 'absolute',
                top: -6,
                right: -8,
                background: 'var(--accent-hot)',
                color: 'white',
                fontSize: '10px',
                fontWeight: 700,
                borderRadius: '50%',
                width: 18,
                height: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
