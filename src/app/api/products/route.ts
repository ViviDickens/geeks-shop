import { NextRequest, NextResponse } from 'next/server';
import { products, getProductsByCategory } from '@/data/products';

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
