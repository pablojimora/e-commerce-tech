import cloudinary from "@/app/lib/cloudinary";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const { file } = await req.json();

    const result = await cloudinary.uploader.upload(file, {
      folder: "products"
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (err: any) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json(
      { error: "Error uploading image" },
      { status: 500 }
    );
  }
}
