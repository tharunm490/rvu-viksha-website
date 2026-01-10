import { Resend } from 'resend';

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/**
 * Sends a contact form notification email via Resend
 */
export async function sendContactEmail(data: {
  fullName: string;
  email: string;
  phone?: string | null;
  message: string;
  date: Date | string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY missing. Email not sent.");
    return false;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br>');
  const submittedAt = new Date(data.date).toLocaleString();
  const recipient = process.env.EMAIL_TO || 'club_viksha@rvu.edu.in';

  try {
    const response = await resend.emails.send({
      from: 'Viksha Contact Form <onboarding@resend.dev>',
      to: [recipient],
      replyTo: data.email,
      subject: `New Message from ${data.fullName} - Viksha Form`,
      html: `
        <h2>New Contact Submission</h2>
        <div style="font-family: sans-serif; line-height: 1.6;">
          <p><strong>Name:</strong> ${data.fullName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
          <div style="background-color: #f4f4f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>Message:</strong><br/>
            ${safeMessage}
          </div>
          <p style="color: #666; font-size: 12px;">Submitted on ${submittedAt}</p>
        </div>
      `
    });

    console.log("Email sent successfully:", response.data?.id);
    return true;
  } catch (err: any) {
    console.error("Email sending failed:", err);
    return false;
  }
}
