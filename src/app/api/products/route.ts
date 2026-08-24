import { NextRequest, NextResponse } from 'next/server';
import { products, getProductsByCategory } from '@/data/products';

// Required because next.config.ts has "output: export": route handlers must
// declare themselves static (no per-request server), or Next throws a 500
// ("force-static"/revalidate not configured...") even in dev. Nothing in the
// app actually calls this route client-side (category filtering happens with
// the imported product array), so caching one static response is safe.
export const dynamic = 'force-static';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');

  let result = products;

  if (category) {
    result = getProductsByCategory(category);
  }

  if (featured === 'true') {
    result = result.filter((p) => p.featured);
  }

  return NextResponse.json({
    data: result,
    total: result.length,
    success: true
  });
}
