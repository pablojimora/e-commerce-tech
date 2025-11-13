import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {

    const { to, subject, html } = await request.json();

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
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { res: "Error enviando mensaje", error: (error as Error).message },
      { status: 500 }
    );
  }
}
