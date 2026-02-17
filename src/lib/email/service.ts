import nodemailer from "nodemailer";

const hasEmailConfig =
  process.env.EMAIL_HOST &&
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASS;

const transporter = hasEmailConfig
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT ?? "587", 10),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  : null;

export async function sendWelcomeEmail(email: string) {
  if (!transporter) {
    console.log("[Email] Welcome email skipped (no config):", email);
    return;
  }
  await transporter.sendMail({
    from: '"ProofAsset" <welcome@proofasset.com>',
    to: email,
    subject: "Welcome to ProofAsset!",
    html: `
      <h1>Welcome to ProofAsset!</h1>
      <p>Thank you for signing up. We're excited to have you on board.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Go to Dashboard</a></p>
    `,
  });
}

export async function sendPaymentReceipt(
  email: string,
  amount: number,
  date: string
) {
  if (!transporter) {
    console.log("[Email] Receipt skipped (no config):", email);
    return;
  }
  await transporter.sendMail({
    from: '"ProofAsset Billing" <billing@proofasset.com>',
    to: email,
    subject: "Your Payment Receipt",
    html: `
      <h1>Payment Receipt</h1>
      <p>Amount: $${amount}</p>
      <p>Date: ${date}</p>
      <p>Thank you for your payment!</p>
    `,
  });
}
