import nodemailer from 'nodemailer';
import { User } from '../../entity/User';
import { confirmationHtml } from './templates/confirmation';

export const sendConfirmationMail = (user: User, token: string) => {
  const transporter = nodemailer.createTransport({
    host: 'email-smtp.eu-central-1.amazonaws.com',
    port: 587,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const message = {
    from: 'yvesysl@protonmail.com',
    to: user.mail,
    subject: 'Επιβεβαίωση email',
    html: confirmationHtml(user, token)
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log('Error occurred. ' + err.message);
    } else {
      console.log('Message sent: %s', info);
    }
  });
};
