import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { getReminderEmailTemplate } from './templates/reminder-payment.template';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailReminder(
    email: string,
    clientName: string,
    numInvoice: string,
    amount: number,
    dueDate: Date,
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Rappel de payement de la facture',
        html: getReminderEmailTemplate(clientName, numInvoice, amount, dueDate),
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException(
        "Error lors de l'envoi de l'email",
      );
    }
  }

  async sendEstimateEmail(
    pdfBuffer: Buffer,
    clientEmail: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: clientEmail,
      subject: 'Votre devis',
      html: `
        <p>Bonjour,</p>
        <p>Veuillez trouver ci-joint votre devis.</p>
        <p>Merci de nous avoir fait confiance.</p>
        <br />
        <p>Cordialement,<br/>Votre société</p>
      `,
      attachments: [
        {
          filename: 'devis.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });
  }
}
