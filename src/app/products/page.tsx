'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { products, categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { Suspense } from 'react';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [selectedCategory, sortBy, searchQuery]);

  return (
    <div className="container" style={{ padding: '48px 24px' }}>
      <h1 data-testid="catalog-title" style={{
        fontFamily: 'var(--font-display)',
        fontSize: '32px',
        marginBottom: '8px'
      }}>
        <span style={{ color: 'var(--accent-primary)' }}>// </span>CATALOG
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        {filtered.length} products found
      </p>

      {/* Filters */}
      <div data-testid="filters" style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        marginBottom: '32px',
        alignItems: 'center'
      }}>
        {/* Search */}
        <input
          data-testid="search-input"
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
          style={{ maxWidth: '280px' }}
        />

        {/* Category filter */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            data-testid="filter-all"
            onClick={() => setSelectedCategory('all')}
            className={`btn ${selectedCategory === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              data-testid={`filter-${cat}`}
              onClick={() => setSelectedCategory(cat)}
              className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 16px', fontSize: '13px', textTransform: 'capitalize' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          data-testid="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="form-input"
          style={{ maxWidth: '200px' }}
        >
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div data-testid="no-results" style={{
          textAlign: 'center',
          padding: '80px',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-display)',
          fontSize: '16px'
        }}>
          No products found for &quot;{searchQuery}&quot;
        </div>
      ) : (
        <div className="products-grid" data-testid="products-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="loading">Loading catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
