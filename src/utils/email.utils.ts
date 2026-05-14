import { IInvoicePDF } from '../models/InvoicePDF';
import nodemailer from 'nodemailer';

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface EmailConfig {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

/**
 * Creates email transporter based on environment configuration
 */
function createTransporter() {
  const emailService = process.env.EMAIL_SERVICE || 'gmail';
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  if (!emailUser || !emailPassword) {
    throw new Error('Email credentials not configured. Set EMAIL_USER and EMAIL_PASSWORD environment variables.');
  }

  return nodemailer.createTransport({
    service: emailService,
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });
}

/**
 * Generates email template for invoice PDF
 */
export function generateInvoiceEmailTemplate(
  invoicePDF: IInvoicePDF,
  clientName: string,
  companyName: string,
): EmailTemplate {
  // Validate that pdf_url exists before generating email
  if (!invoicePDF.pdf_url) {
    throw new Error('PDF URL no disponible. El PDF debe estar almacenado antes de enviar el email.');
  }

  const subject = `Factura Electrónica - ${invoicePDF.claveAcceso}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Factura Electrónica</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .content { margin-bottom: 20px; }
        .footer { font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 10px; }
        .invoice-details { background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .download-button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 15px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Factura Electrónica</h2>
          <p>Estimado/a ${clientName},</p>
        </div>

        <div class="content">
          <p>Su factura electrónica ha sido emitida por <strong>${companyName}</strong>.</p>

          <div class="invoice-details">
            <strong>Detalles de la Factura:</strong><br>
            <strong>Clave de Acceso:</strong> ${invoicePDF.claveAcceso}<br>
            <strong>Número de Autorización:</strong> ${invoicePDF.numero_autorizacion}<br>
            <strong>Fecha de Autorización:</strong> ${invoicePDF.fecha_autorizacion.toLocaleDateString('es-EC')}<br>
            <strong>Fecha de Generación PDF:</strong> ${invoicePDF.fecha_generacion.toLocaleDateString('es-EC')}
          </div>

          <p style="text-align: center;">
            <a href="${invoicePDF.pdf_url}" class="download-button">Descargar Factura PDF</a>
          </p>

          <p>Por favor, conserve este documento para sus registros contables.</p>

          <p>Si tiene alguna consulta sobre esta factura, no dude en contactarnos.</p>
        </div>

        <div class="footer">
          <p>Este es un mensaje automático. Por favor, no responda a este correo.</p>
          <p>Factura generada por Veronica-EC - Sistema de Facturación Electrónica Libre</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Factura Electrónica

    Estimado/a ${clientName},

    Su factura electrónica ha sido emitida por ${companyName}.

    Detalles de la Factura:
    Clave de Acceso: ${invoicePDF.claveAcceso}
    Número de Autorización: ${invoicePDF.numero_autorizacion}
    Fecha de Autorización: ${invoicePDF.fecha_autorizacion.toLocaleDateString('es-EC')}
    Fecha de Generación PDF: ${invoicePDF.fecha_generacion.toLocaleDateString('es-EC')}

    Descargar PDF: ${invoicePDF.pdf_url}

    Por favor, conserve este documento para sus registros contables.

    Si tiene alguna consulta sobre esta factura, no dude en contactarnos.

    Este es un mensaje automático. Por favor, no responda a este correo.
    Factura generada por Veronica-EC - Sistema de Facturación Electrónica Libre
  `;

  return { subject, html, text };
}

/**
 * Prepares email configuration for sending
 *
 * NOTA: Ya no adjuntamos el PDF directamente en el email.
 * En su lugar, el email incluye un enlace de descarga a la URL pública del PDF.
 * Esto reduce el tamaño de los emails y mejora la velocidad de envío.
 *
 * Si necesitas adjuntar el PDF directamente, puedes descargarlo desde pdf_url
 * usando axios o fetch y agregarlo como attachment.
 */
export function prepareEmailConfig(
  invoicePDF: IInvoicePDF,
  emailTemplate: EmailTemplate,
  recipientEmail: string,
): EmailConfig {
  const config: EmailConfig = {
    to: recipientEmail,
    subject: emailTemplate.subject,
    html: emailTemplate.html,
    text: emailTemplate.text,
  };

  // NOTA: Ya no adjuntamos el PDF porque ya no guardamos pdf_buffer
  // El email ahora incluye un enlace de descarga a invoicePDF.pdf_url
  // Si en el futuro necesitas adjuntar el PDF, puedes:
  // 1. Descargar el PDF desde invoicePDF.pdf_url usando axios
  // 2. Agregarlo como attachment

  return config;
}

/**
 * Validates email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sends invoice email using configured email service
 */
export async function sendInvoiceEmail(
  invoicePDF: IInvoicePDF,
  recipientEmail: string,
  clientName: string,
  companyName: string,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Validate email
    if (!isValidEmail(recipientEmail)) {
      throw new Error('Formato de email inválido');
    }

    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('Email service not configured. Email sending is disabled.');
      return {
        success: false,
        error: 'Servicio de email no configurado. Configure EMAIL_USER y EMAIL_PASSWORD.',
      };
    }

    // Generate email template
    const template = generateInvoiceEmailTemplate(invoicePDF, clientName, companyName);

    // Prepare email config
    const emailConfig = prepareEmailConfig(invoicePDF, template, recipientEmail);

    // Create transporter and send email
    const transporter = createTransporter();
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      ...emailConfig,
    });

    console.log('✅ Email sent successfully:', {
      to: emailConfig.to,
      subject: emailConfig.subject,
      messageId: result.messageId,
    });

    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}
