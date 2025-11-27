import { NextResponse } from "next/server";
import dbConnection from "@/app/lib/dbconection";
import Users from "@/app/models/user";
import nodemailer from "nodemailer";

export async function GET(request: Request) {
  try {
    // Verificar que la petición venga de Vercel Cron (seguridad básica)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnection();

    // Obtener todos los usuarios con email
    const users = await Users.find({ email: { $exists: true, $ne: null } }).lean();

    if (users.length === 0) {
      return NextResponse.json({ message: 'No users to send emails', sent: 0 });
    }

    // Configurar transporter de nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Plantilla del email promocional
    const emailTemplate = (userName: string) => `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
          .content { padding: 30px; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .products { display: grid; gap: 20px; margin: 20px 0; }
          .product-item { border: 1px solid #e0e0e0; padding: 15px; border-radius: 8px; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 ¡Ofertas Especiales en Copcity!</h1>
            <p>Tecnología de primera a precios increíbles</p>
          </div>
          <div class="content">
            <p>Hola ${userName || 'Amigo'},</p>
            <p>¡Tenemos increíbles ofertas en tecnología esperándote! 🚀</p>
            
            <h2>📱 Destacados del Día:</h2>
            <div class="products">
              <div class="product-item">
                <strong>💻 Laptops Gaming</strong>
                <p>Hasta 30% de descuento en las mejores marcas</p>
              </div>
              <div class="product-item">
                <strong>🎧 Audio Premium</strong>
                <p>Auriculares y parlantes con envío gratis</p>
              </div>
              <div class="product-item">
                <strong>📷 Accesorios Tech</strong>
                <p>Los mejores complementos para tu setup</p>
              </div>
            </div>

            <div style="text-align: center;">
              <a href="https://e-commerce-tech-phi.vercel.app/dashboard/products" class="cta-button">
                Ver Todas las Ofertas
              </a>
            </div>

            <p style="margin-top: 30px; color: #666;">
              ⏰ <strong>Ofertas válidas solo hoy</strong><br>
              No te pierdas estas increíbles oportunidades
            </p>
          </div>
          <div class="footer">
            <p>Copcity - Tu tienda de tecnología de confianza</p>
            <p>📧 ¿No quieres recibir estos emails? <a href="#">Cancelar suscripción</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    let sentCount = 0;
    let failedCount = 0;

    // Enviar emails en lotes para no sobrecargar
    for (const user of users) {
      try {
        await transporter.sendMail({
          from: `"Copcity Tech Store" <${process.env.MAIL_USER}>`,
          to: user.email,
          subject: "🎉 Ofertas Especiales del Día - Copcity",
          html: emailTemplate(user.name || ""),
        });
        sentCount++;
        
        // Pequeña pausa entre emails para no ser marcado como spam
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error sending email to ${user.email}:`, error);
        failedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Promotional emails sent',
      sent: sentCount,
      failed: failedCount,
      total: users.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}
