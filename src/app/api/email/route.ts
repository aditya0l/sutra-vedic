import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import {
    getAdminNewOrderEmail,
    getAdminPaymentRefEmail,
    getCustomerOrderConfirmationEmail,
    getCustomerStatusUpdateEmail
} from '@/lib/email-templates';

// Ensure the application doesn't crash if SMTP is not configured yet
const isSMTPConfigured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const ADMIN_EMAIL = 'admin@sutravedic.com';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, order, locale, customerEmail, customerName, extra } = body;

        if (!action || !order || !customerEmail) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!isSMTPConfigured) {
            console.warn('[Email system] SMTP is not configured. Email will not be sent.', { action, orderId: order.id });
            return NextResponse.json({ success: true, warning: 'SMTP not configured, simulated success.' });
        }

        const emailProps = { order, locale: locale || 'en', customerEmail, customerName, extra };
        const emailsToSend = [];

        switch (action) {
            case 'ORDER_CREATED':
                // 1. Notify Admin
                emailsToSend.push({
                    from: `"Sutra Vedic Store" <${process.env.SMTP_USER}>`,
                    to: ADMIN_EMAIL,
                    ...getAdminNewOrderEmail(emailProps)
                });
                // 2. Notify Customer (includes bank transfer instructions)
                emailsToSend.push({
                    from: `"Sutra Vedic" <${process.env.SMTP_USER}>`,
                    to: customerEmail,
                    ...getCustomerOrderConfirmationEmail(emailProps)
                });
                break;

            case 'PAYMENT_SUBMITTED':
                // Notify Admin that customer submitted a reference
                emailsToSend.push({
                    from: `"Sutra Vedic System" <${process.env.SMTP_USER}>`,
                    to: ADMIN_EMAIL,
                    ...getAdminPaymentRefEmail(emailProps)
                });
                break;

            case 'STATUS_UPDATED':
                if (['processing', 'shipped', 'delivered', 'cancelled'].includes(order.status)) {
                    // Update Customer
                    emailsToSend.push({
                        from: `"Sutra Vedic" <${process.env.SMTP_USER}>`,
                        to: customerEmail,
                        ...getCustomerStatusUpdateEmail(emailProps)
                    });
                }
                break;

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        // Dispatch all emails concurrently
        await Promise.all(
            emailsToSend.map(async (mailOptions) => {
                try {
                    const info = await transporter.sendMail(mailOptions);
                    console.log(`Email sent: ${info.messageId}`);
                } catch (error) {
                    console.error('Failed to send email:', error);
                    // Do not throw to allow other emails in the batch to process
                }
            })
        );

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Email API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
