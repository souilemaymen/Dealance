import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic'; // Désactiver le cache si nécessaire

// Utilisez des exports nommés pour chaque méthode HTTP
export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    // Validation des données
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Tous les champs sont requis" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Nouveau message de ${name} (${email})`,
      text: message,
      html: `<div>
             <h3>Message de ${name} (${email})</h3>
             <p>${message}</p>
           </div>`,
    };

    await transporter.sendMail(mailOptions);
    
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Erreur complète:", error);
    return new Response(
      JSON.stringify({ error: "Erreur d'envoi du message" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Optionnel : Gérer les autres méthodes
export async function GET() {
  return new Response(
    JSON.stringify({ error: "Méthode non autorisée" }),
    { status: 405, headers: { 'Content-Type': 'application/json' } }
  );
}