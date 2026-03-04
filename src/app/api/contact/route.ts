import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const ADMIN_EMAIL = 'contact@sutravedic.fr';

export async function POST(request: Request) {
    try {
        const { name, email, subject, message, locale } = await request.json();

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await transporter.sendMail({
            from: `"Sutra Vedic Contact Form" <${process.env.SMTP_USER}>`,
            to: ADMIN_EMAIL,
            replyTo: email,
            subject: `[Contact] ${subject} — from ${name}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 32px; background: #f9f9f9; border-radius: 12px;">
                    <h2 style="color: #0F2E22; margin-bottom: 4px;">New Contact Message</h2>
                    <p style="color: #888; font-size: 13px; margin-bottom: 24px;">via sutravedic.fr contact form</p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #555; font-size: 13px; width: 90px;">Name</td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600; font-size: 13px;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #555; font-size: 13px;">Email</td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px;"><a href="mailto:${email}" style="color: #0F2E22;">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #555; font-size: 13px;">Subject</td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600; font-size: 13px;">${subject}</td>
                        </tr>
                    </table>
                    <div style="margin-top: 24px; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #eee;">
                        <p style="color: #555; font-size: 12px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.08em;">Message</p>
                        <p style="font-size: 14px; color: #111; white-space: pre-wrap; margin: 0;">${message}</p>
                    </div>
                    <p style="margin-top: 24px; font-size: 12px; color: #aaa;">Reply directly to this email to respond to ${name}.</p>
                </div>
            `,
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Contact email error:', err);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
