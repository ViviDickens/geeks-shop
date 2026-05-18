import Link from 'next/link';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
}

const badgeClass = (badge?: string) => {
  if (!badge) return '';
  if (badge === 'Hot' || badge === 'Best Seller') return 'badge badge-hot';
  if (badge === 'New') return 'badge badge-new';
  if (badge === 'Limited') return 'badge badge-limited';
  return 'badge badge-default';
};

export default function ProductCard({ product }: ProductCardProps) {
  const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));

  return (
    <Link
      href={`/products/${product.id}`}
      data-testid={`product-card-${product.id}`}
      style={{ textDecoration: 'none' }}
    >
      <div
        className={`card ${product.stock === 0 ? 'out-of-stock' : ''}`}
        style={{ overflow: 'hidden', cursor: 'pointer' }}
      >
        {/* Image placeholder */}
        <div
          data-testid={`product-image-${product.id}`}
          style={{
            height: 200,
            background: `linear-gradient(135deg, var(--bg-secondary), var(--bg-card-hover))`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '60px',
            position: 'relative'
          }}
        >
          {categoryEmoji(product.category)}

          {product.badge && (
            <span
              data-testid={`product-badge-${product.id}`}
              className={badgeClass(product.badge)}
              style={{ position: 'absolute', top: 12, right: 12 }}
            >
              {product.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '16px' }}>
          <p style={{
            fontSize: '11px',
            letterSpacing: '0.1em',
            color: 'var(--accent-secondary)',
            textTransform: 'uppercase',
            marginBottom: '4px'
          }}>
            {product.category}
          </p>

          <h3
            data-testid={`product-name-${product.id}`}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '14px',
              marginBottom: '8px',
              color: 'var(--text-primary)',
              lineHeight: 1.4
            }}
          >
            {product.name}
          </h3>

          <div className="stars" data-testid={`product-rating-${product.id}`}>
            {stars}
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: 4 }}>
              ({product.rating})
            </span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '12px'
          }}>
            <span
              data-testid={`product-price-${product.id}`}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--accent-primary)'
              }}
            >
              ${product.price.toFixed(2)}
            </span>

            <span style={{
              fontSize: '12px',
              color: product.stock === 0
                ? 'var(--accent-hot)'
                : product.stock < 5
                  ? '#ffaa00'
                  : 'var(--text-muted)'
            }}>
              {product.stock === 0
                ? 'Out of stock'
                : product.stock < 5
                  ? `Only ${product.stock} left`
                  : `${product.stock} in stock`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function categoryEmoji(category: string) {
  const map: Record<string, string> = {
    gaming: '🎮',
    anime: '⛩️',
    tech: '🔧',
    collectibles: '📦'
  };
  return map[category] || '🛒';
}
