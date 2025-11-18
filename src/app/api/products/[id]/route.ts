import { NextResponse } from "next/server";
import dbConnection from "@/app/lib/dbconection";
import Products from "@/app/models/products";


dbConnection();

// PUT - Actualizar producto por ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { name, brand, quantity, price, isActive, category, imageUrl } = body;

    // `params` might be a Promise in some Next.js versions — unwrap it first
    const { id } = (await params) as { id: string };

    const updated = await Products.findByIdAndUpdate(
      id,
      { name, brand, quantity, price, isActive, category, imageUrl },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { ok: false, error: "No encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, data: [updated] });
  } catch (error) {
    console.error(" Error en PUT /api/products/[id]:", error);
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// GET - Obtener producto por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = (await params) as { id: string };

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "ID no proporcionado" },
        { status: 400 }
      );
    }

    const product = await Products.findById(id);
    if (!product) {
      return NextResponse.json({ ok: false, error: "No encontrado" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: product });
  } catch (error) {
    console.error(" Error en GET /api/products/[id]:", error);
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

//  DELETE - Eliminar producto por ID
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    // Unwrap params if necessary
    const { id } = (await params) as { id: string };

    // Validate id
    if (!id) {
      return NextResponse.json(
        { ok: false, error: "ID no proporcionado" },
        { status: 400 }
      );
    }

    const deleted = await Products.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { ok: false, error: "No encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, data: [deleted] });
  } catch (error) {
    console.error(" Error en DELETE /api/products/[id]:", error);
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
