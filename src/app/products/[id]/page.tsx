import { notFound } from 'next/navigation';
import { products, getProductById } from '@/data/products';
import ProductDetailClient from './ProductDetailClient';

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

// Required because next.config.ts has "output: export": with dynamicParams
// left at its default (true), Next has no server to render unlisted ids on
// demand and throws a hard 500 ("missing param ... required with output:
// export") before this component ever runs. Setting it to false tells Next
// to treat any id outside generateStaticParams() as a normal 404 instead,
// which lets the notFound() call below actually do its job.
export const dynamicParams = false;

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);

  // notFound() has to be called from a Server Component to reliably set a real
  // 404 status. Calling it from inside ProductDetailClient (a 'use client'
  // component) was causing an unhandled error (500) instead of a clean 404 for
  // unknown product ids.
  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
