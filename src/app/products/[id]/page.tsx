import { products } from '@/data/products';
import ProductDetailClient from './ProductDetailClient';

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailClient id={id} />;
}
