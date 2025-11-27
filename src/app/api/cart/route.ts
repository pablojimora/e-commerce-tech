import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnection from '@/app/lib/dbconection';
import Users from '@/app/models/user';
import Products from '@/app/models/products';
import mongoose from 'mongoose';

// GET -> returns the current user's cart
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    console.log('Cart GET - Session:', session ? 'exists' : 'null', (session?.user as any)?.id);
    
    if (!session?.user || !(session.user as any).id) {
      console.log('Cart GET - Unauthorized: no session or user id');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnection();
    const userId = (session.user as any).id;
    const user: any = await Users.findById(userId).lean();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Enriquecer con stock actual de productos
    const cartWithStock = await Promise.all((user.cart || []).map(async (c: any) => {
      const product: any = await Products.findById(c.productId).lean();
      return {
        productId: c.productId?.toString?.() || String(c.productId),
        name: c.name,
        price: c.price,
        imageUrl: c.imageUrl,
        quantity: c.quantity,
        stock: product?.quantity || 0,
        brand: product?.brand || '',
        category: product?.category || '',
        addedAt: c.addedAt,
      };
    }));

    return NextResponse.json({ data: cartWithStock });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST -> add/update item in cart
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { productId, quantity = 1, replace = false } = body as { productId: string; quantity?: number; replace?: boolean };
    if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });

    if (!mongoose.Types.ObjectId.isValid(productId)) return NextResponse.json({ error: 'Invalid productId' }, { status: 400 });

    await dbConnection();
    const product: any = await Products.findById(productId).lean();
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const userId = (session.user as any).id;
    const user: any = await Users.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const existing = user.cart?.find((c: any) => c.productId.toString() === productId);
    if (existing) {
      // if replace: set to quantity; else increment
      if (replace) existing.quantity = quantity;
      else existing.quantity = (existing.quantity || 0) + (quantity || 1);
    } else {
      user.cart = user.cart || [];
      user.cart.push({
        productId: product._id,
        name: product.name || '',
        price: product.price || 0,
        imageUrl: product.imageUrl || '',
        quantity: quantity || 1,
        addedAt: new Date(),
      });
    }

    await user.save();

    // Enriquecer con stock actual de productos
    const cartWithStock = await Promise.all((user.cart || []).map(async (c: any) => {
      const prod: any = await Products.findById(c.productId).lean();
      return {
        productId: c.productId?.toString?.() || String(c.productId),
        name: c.name,
        price: c.price,
        imageUrl: c.imageUrl,
        quantity: c.quantity,
        stock: prod?.quantity || 0,
        brand: prod?.brand || '',
        category: prod?.category || '',
        addedAt: c.addedAt,
      };
    }));

    return NextResponse.json({ data: cartWithStock });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE -> either remove a specific product or clear entire cart
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const productId = url.searchParams.get('productId');

    await dbConnection();
    const userId = (session.user as any).id;
    const user: any = await Users.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (productId) {
      user.cart = (user.cart || []).filter((c: any) => c.productId.toString() !== productId);
    } else {
      user.cart = [];
    }

    await user.save();
    
    // Enriquecer con stock actual de productos
    const cartWithStock = await Promise.all((user.cart || []).map(async (c: any) => {
      const prod: any = await Products.findById(c.productId).lean();
      return {
        productId: c.productId?.toString?.() || String(c.productId),
        name: c.name,
        price: c.price,
        imageUrl: c.imageUrl,
        quantity: c.quantity,
        stock: prod?.quantity || 0,
        brand: prod?.brand || '',
        category: prod?.category || '',
        addedAt: c.addedAt,
      };
    }));

    return NextResponse.json({ data: cartWithStock });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
