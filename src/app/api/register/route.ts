import { NextResponse } from "next/server";
import dbConnection from "@/app/lib/dbconection";
import Users from "@/app/models/user";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    await dbConnection();
    const existing = await Users.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = await Users.create({ email, name: name || email, password: hashed, role: 'user' });

    return NextResponse.json({ data: { id: user._id.toString(), email: user.email, name: user.name, role: user.role } }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
