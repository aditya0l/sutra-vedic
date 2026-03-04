import { Order, Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface EmailTemplateProps {
    order: Order;
    locale: 'en' | 'fr';
    customerEmail: string;
    customerName: string;
    extra?: any;
}

const styles = `
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #374151; line-height: 1.6; margin: 0; padding: 0; background-color: #f9fafb; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { background-color: #0F2E22; color: #ffffff; padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.05em; }
    .content { padding: 32px 24px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #C9A84C; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600; margin-top: 16px; }
    .order-details { margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 24px; }
    .item-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
    .total-row { display: flex; justify-content: space-between; margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-weight: bold; font-size: 16px; }
    .footer { background-color: #f3f4f6; color: #6b7280; padding: 24px; text-align: center; font-size: 12px; }
    .info-box { background-color: #FEFAE0; border: 1px solid #E8D8A0; border-radius: 8px; padding: 16px; margin: 24px 0; }
    .label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
    .value { font-size: 14px; font-weight: 500; color: #111827; }
`;

function buildOrderSummary(order: Order, locale: 'en' | 'fr') {
    const itemsHtml = order.items.map(item => {
        const name = typeof item.product.name === 'object' ? (locale === 'fr' ? item.product.name.fr : item.product.name.en) : item.product.name;
        // The API maps generic records for items, let's format safely
        const price = (item as any).price || (item as any).unitPrice || item.product.price;
        return `
            <div class="item-row">
                <span>${item.quantity}x ${name}</span>
                <span>${formatPrice(price * item.quantity)}</span>
            </div>
        `;
    }).join('');

    return `
        <div class="order-details">
            <h3 style="margin-top: 0; font-size: 16px;">${locale === 'fr' ? 'Détails de la commande' : 'Order Details'} (Ref: SUTRAVEDIC-${order.id.slice(0, 8).toUpperCase()})</h3>
            ${itemsHtml}
            <div class="total-row">
                <span>Total</span>
                <span>${formatPrice(order.total)}</span>
            </div>
        </div>
    `;
}

// ─── ADMIN TEMPLATES ────────────────────────────────────────────────────────

export function getAdminNewOrderEmail({ order, customerName, customerEmail }: EmailTemplateProps) {
    const ref = order.id.slice(0, 8).toUpperCase();
    return {
        subject: `[New Order] SUTRAVEDIC-${ref} - €${order.total.toFixed(2)}`,
        html: `
            <html>
                <head><style>${styles}</style></head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>New Order Received</h1>
                        </div>
                        <div class="content">
                            <p>You have received a new order from <strong>${customerName}</strong> (<a href="mailto:${customerEmail}">${customerEmail}</a>).</p>
                            <p>Order Reference: <strong>SUTRAVEDIC-${ref}</strong></p>
                            <p>Status: <span style="color: #92400e; background: #fef3c7; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold;">Pending Payment</span></p>
                            
                            <div class="info-box">
                                <div class="label">Shipping Address</div>
                                <div class="value">
                                    ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
                                    ${order.shippingAddress.address}<br>
                                    ${order.shippingAddress.city}, ${order.shippingAddress.zipCode}, ${order.shippingAddress.country}
                                </div>
                            </div>

                            ${buildOrderSummary(order, 'en')}
                            
                            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" class="button">View in Admin Panel</a>
                        </div>
                    </div>
                </body>
            </html>
        `
    };
}

export function getAdminPaymentRefEmail({ order, customerName, extra }: EmailTemplateProps) {
    const ref = order.id.slice(0, 8).toUpperCase();
    return {
        subject: `[Payment Reference] Order SUTRAVEDIC-${ref} updated`,
        html: `
            <html>
                <head><style>${styles}</style></head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Payment Reference Submitted</h1>
                        </div>
                        <div class="content">
                            <p><strong>${customerName}</strong> has submitted a payment reference for order SUTRAVEDIC-${ref}.</p>
                            
                            <div class="info-box" style="background-color: #f0fdf4; border-color: #bbf7d0;">
                                <div class="label">Payment Reference Provided</div>
                                <div class="value" style="font-size: 18px; font-family: monospace; text-align: center; margin-top: 8px;">
                                    ${extra?.paymentReference || 'N/A'}
                                </div>
                            </div>
                            
                            <p>Please check your bank account to verify the transfer and update the order status to "Confirmed" in the admin panel.</p>
                            
                            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" class="button">Verify in Admin Panel</a>
                        </div>
                    </div>
                </body>
            </html>
        `
    };
}

// ─── CUSTOMER TEMPLATES ─────────────────────────────────────────────────────

export function getCustomerOrderConfirmationEmail({ order, locale, customerName, extra }: EmailTemplateProps) {
    const isFr = locale === 'fr';
    const ref = order.id.slice(0, 8).toUpperCase();
    const bankInfo = extra?.bankInfo || { accountHolder: '', bankName: '', iban: '', bic: '' };

    return {
        subject: isFr ? `Votre commande Sutra Vedic est confirmée (SUTRAVEDIC-${ref})` : `Your Sutra Vedic order is confirmed (SUTRAVEDIC-${ref})`,
        html: `
            <html>
                <head><style>${styles}</style></head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Sutra Vedic</h1>
                        </div>
                        <div class="content">
                            <h2>${isFr ? 'Merci pour votre commande !' : 'Thank you for your order!'}</h2>
                            <p>${isFr ? `Bonjour ${customerName},` : `Hello ${customerName},`}</p>
                            <p>${isFr ? 'Votre commande a bien été prise en compte et est en attente de paiement par virement bancaire.' : 'Your order has been received and is awaiting payment via bank transfer.'}</p>
                            
                            <div class="info-box">
                                <h3 style="margin-top: 0; color: #0F2E22;">${isFr ? 'Instructions de virement' : 'Bank Transfer Instructions'}</h3>
                                <p style="font-size: 13px; margin-bottom: 16px;">
                                    ${isFr
                ? 'Veuillez effectuer votre virement en utilisant les informations ci-dessous. Veuillez inclure le numéro de référence dans le libellé du virement.'
                : 'Please complete your bank transfer using the details below. Please include the reference number in the transfer description.'}
                                </p>
                                
                                <div style="margin-bottom: 8px;"><span class="label">IBAN:</span> <span class="value" style="font-family: monospace;">${bankInfo.iban}</span></div>
                                <div style="margin-bottom: 8px;"><span class="label">BIC:</span> <span class="value" style="font-family: monospace;">${bankInfo.bic}</span></div>
                                <div style="margin-bottom: 8px;"><span class="label">${isFr ? 'Bénéficiaire' : 'Account Holder'}:</span> <span class="value">${bankInfo.accountHolder}</span></div>
                                <div style="margin-bottom: 8px;"><span class="label">Banque:</span> <span class="value">${bankInfo.bankName}</span></div>
                                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed #E8D8A0;">
                                    <div style="margin-bottom: 8px;"><span class="label">${isFr ? 'Montant à transférer' : 'Amount to transfer'}:</span> <span class="value" style="color: #C9A84C; font-size: 18px; font-weight: bold;">${formatPrice(order.total)}</span></div>
                                    <div><span class="label">${isFr ? 'Référence de virement' : 'Transfer Reference'}:</span> <span class="value" style="font-family: monospace;">SUTRAVEDIC-${ref}</span></div>
                                </div>
                            </div>
                            
                            <p>
                                ${isFr
                ? 'Une fois le virement effectué, vous pouvez nous communiquer la référence de transaction depuis votre espace ou répondre à cet email.'
                : 'Once the transfer is complete, you can provide the transaction reference from your account area or reply to this email.'}
                            </p>

                            ${buildOrderSummary(order, locale)}
                            
                            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/compte/commandes" class="button">${isFr ? 'Voir ma commande' : 'View my order'}</a>
                        </div>
                        <div class="footer">
                            <p>Sutra Vedic - 5 Rue Muller, 75018 Paris, France</p>
                            <p><a href="mailto:contact@sutravedic.fr" style="color: #6b7280;">contact@sutravedic.fr</a></p>
                        </div>
                    </div>
                </body>
            </html>
        `
    };
}

export function getCustomerStatusUpdateEmail({ order, locale, customerName, extra }: EmailTemplateProps) {
    const isFr = locale === 'fr';
    const ref = order.id.slice(0, 8).toUpperCase();
    const status = order.status;

    let title = '';
    let message = '';

    if (status === 'processing') {
        title = isFr ? 'Paiement Confirmé' : 'Payment Confirmed';
        message = isFr
            ? 'Nous avons bien reçu votre paiement. Votre commande est maintenant en cours de préparation.'
            : 'We have received your payment. Your order is now being processed.';
    } else if (status === 'shipped') {
        title = isFr ? 'Commande Expédiée' : 'Order Shipped';
        message = isFr
            ? 'Bonne nouvelle ! Votre commande vient d\'être expédiée.'
            : 'Great news! Your order has just been shipped.';

        if (extra?.trackingNumber) {
            message += `<br><br><strong>${isFr ? 'N° de suivi' : 'Tracking Number'}:</strong> <span style="font-family: monospace;">${extra.trackingNumber}</span>`;
        }
    } else if (status === 'delivered') {
        title = isFr ? 'Commande Livrée' : 'Order Delivered';
        message = isFr
            ? 'Votre commande a été marquée comme livrée. Nous espérons que vous apprécierez vos produits !'
            : 'Your order has been marked as delivered. We hope you enjoy your products!';
    } else if (status === 'cancelled') {
        title = isFr ? 'Commande Annulée' : 'Order Cancelled';
        message = isFr
            ? 'Votre commande a été annulée.'
            : 'Your order has been cancelled.';
        if (extra?.adminNote) {
            message += `<br><br><strong>${isFr ? 'Raison' : 'Reason'}:</strong> ${extra.adminNote}`;
        }
    }

    return {
        subject: `[Sutra Vedic] ${title} (SUTRAVEDIC-${ref})`,
        html: `
            <html>
                <head><style>${styles}</style></head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Sutra Vedic</h1>
                        </div>
                        <div class="content">
                            <h2>${title}</h2>
                            <p>${isFr ? `Bonjour ${customerName},` : `Hello ${customerName},`}</p>
                            <p>${message}</p>
                            
                            ${buildOrderSummary(order, locale)}
                            
                            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/compte/commandes" class="button">${isFr ? 'Voir ma commande' : 'View my order'}</a>
                        </div>
                        <div class="footer">
                            <p>Sutra Vedic - 5 Rue Muller, 75018 Paris, France</p>
                            <p><a href="mailto:contact@sutravedic.fr" style="color: #6b7280;">contact@sutravedic.fr</a></p>
                        </div>
                    </div>
                </body>
            </html>
        `
    };
}
