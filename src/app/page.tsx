import Link from 'next/link';
import { getFeaturedProducts } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <div>
      {/* Hero */}
      <section data-testid="hero" style={{
        padding: '100px 24px',
        textAlign: 'center',
        background: `
          radial-gradient(ellipse at 20% 50%, #7b2fff15 0%, transparent 60%),
          radial-gradient(ellipse at 80% 50%, #00f5d415 0%, transparent 60%)
        `
      }}>
        <p data-testid="hero-subtitle" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '13px',
          letterSpacing: '0.3em',
          color: 'var(--accent-primary)',
          marginBottom: '16px'
        }}>
          // YOUR GEEK UNIVERSE
        </p>

        <h1 data-testid="hero-title" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(40px, 8vw, 80px)',
          fontWeight: 900,
          lineHeight: 1.1,
          marginBottom: '24px'
        }}>
          LEVEL UP<br />
          <span style={{ color: 'var(--accent-primary)' }}>YOUR LIFE</span>
        </h1>

        <p data-testid="hero-description" style={{
          color: 'var(--text-secondary)',
          fontSize: '18px',
          maxWidth: '500px',
          margin: '0 auto 40px'
        }}>
          Gaming gear, anime collectibles, and tech gadgets for the culture.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/products" data-testid="hero-cta-primary" className="btn btn-primary">
            Shop Now →
          </Link>
          <Link href="/products?category=gaming" data-testid="hero-cta-secondary" className="btn btn-secondary">
            Gaming Gear
          </Link>
        </div>
      </section>

      <div className="glow-line" />

      {/* Featured Products */}
      <section data-testid="featured-section" className="container" style={{ padding: '48px 24px' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '24px',
          marginBottom: '32px',
          color: 'var(--text-primary)'
        }}>
          <span style={{ color: 'var(--accent-primary)' }}>// </span>
          FEATURED DROPS
        </h2>

        <div className="products-grid" data-testid="featured-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link href="/products" data-testid="view-all-link" className="btn btn-secondary">
            View All Products
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section data-testid="stats-section" style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '32px 24px',
        marginTop: '48px'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          {[
            { label: 'Products', value: '200+', testid: 'stat-products' },
            { label: 'Happy Geeks', value: '12K+', testid: 'stat-users' },
            { label: 'Categories', value: '4', testid: 'stat-categories' },
            { label: 'Hours of Fun', value: '∞', testid: 'stat-fun' }
          ].map((stat) => (
            <div key={stat.testid} data-testid={stat.testid} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '32px',
                fontWeight: 900,
                color: 'var(--accent-primary)'
              }}>
                {stat.value}
              </div>
              <div style={{
                color: 'var(--text-secondary)',
                fontSize: '13px',
                letterSpacing: '0.1em'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
