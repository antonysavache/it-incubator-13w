import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendRegistrationEmail(email: string, confirmationCode: string): Promise<void> {
    // В реальном приложении здесь был бы код для отправки электронной почты
    console.log(`Sending registration email to ${email} with confirmation code: ${confirmationCode}`);
    return Promise.resolve();
  }

  async sendPasswordRecoveryEmail(email: string, recoveryCode: string): Promise<void> {
    // В реальном приложении здесь был бы код для отправки электронной почты
    console.log(`Sending password recovery email to ${email} with recovery code: ${recoveryCode}`);
    return Promise.resolve();
  }
}
