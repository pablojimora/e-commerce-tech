import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { emailSchema } from "./validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validación con Yup
    await emailSchema.validate(body, { abortEarly: false });

    const { to, subject, html } = body;

    const userMail = process.env.MAIL_USER;
    const passMail = process.env.MAIL_PASS;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: userMail,
        pass: passMail,
      },
    });

    await transporter.sendMail({
      from: '"Pablodev" <no-reply@pablodev.com>',
      to,
      subject,
      html,
    });

    return NextResponse.json({ res: "Mensaje enviado" }, { status: 200 });
  } catch (error: any) {
    console.error(error);

    if (error.inner) {
      return NextResponse.json(
        { error: error.inner.map((e: any) => e.message) },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { res: "Error enviando mensaje", error: error.message },
      { status: 500 }
    );
  }
}
