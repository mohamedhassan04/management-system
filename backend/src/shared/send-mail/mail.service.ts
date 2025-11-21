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
}
