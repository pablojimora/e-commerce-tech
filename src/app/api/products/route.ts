import { NextResponse } from "next/server";
import dbConnection from "@/app/lib/dbconection";
import Products from "@/app/models/products";
import { Product } from "@/app/interfaces/products";

// Conectamos a la base de datos una vez por cada invocación
dbConnection();

// GET - Obtener productos (opcionalmente filtrados por categoría o marca) con paginación
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    const filters: Record<string, unknown> = {};
    if (category) filters.category = category;
    if (brand) filters.brand = { $regex: new RegExp(brand, "i") };

    const skip = (page - 1) * limit;
    const total = await Products.countDocuments(filters);
    const products = await Products.find(filters)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({
      ok: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error(" Error en GET /api/products:", error);
    return NextResponse.json(
      { ok: false, error: "Error al obtener los productos" },
      { status: 500 }
    );
  }
}

//  POST - Crear producto
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, brand, quantity, price, isActive, category, imageUrl } = body;

    const lastProduct = await Products.findOne().sort({ sku: -1 }).limit(1);
    const newSkuProduct = lastProduct ? lastProduct.sku + 1 : 1;

    const newProduct = new Products({
      sku: newSkuProduct,
      name,
      brand,
      quantity,
      price,
      isActive,
      category,
      imageUrl,
    });

    const savedProduct = await newProduct.save();
    const productData: Product = savedProduct.toObject();

    return NextResponse.json({ ok: true, data: [productData] });
  } catch (error) {
    console.error("Error en POST /api/products:", error);
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
