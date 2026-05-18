import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '@/data/products';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = getProductById(params.id);

  if (!product) {
    return NextResponse.json(
      { error: 'Product not found', success: false },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: product, success: true });
}
