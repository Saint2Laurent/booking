import nodemailer from 'nodemailer';
import { User } from '../../entity/User';
import { confirmationHtml } from './templates/confirmation';
import { passwordResetHtml } from './templates/password-reset';

export const sendPasswordResetMail = (user: User, token: string) => {
  const transporter = nodemailer.createTransport({
    host: 'email-smtp.eu-central-1.amazonaws.com',
    port: 587,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const message = {
    from: 'password-reset@ubook.gr',
    to: user.mail,
    subject: 'Επαναφορα κωδικου',
    html: passwordResetHtml(user, token)
  };

  let mailSent = false;

  transporter.sendMail(message, err => {
    console.log(err);
    if (!err) {
      mailSent = true;
    }
  });

  return mailSent;
};

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
    from: 'verify@ubook.gr',
    to: user.mail,
    subject: 'Επιβεβαίωση email',
    html: confirmationHtml(user, token)
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log('Error occurred. ' + err);
    } else {
      console.log('Message sent: %s', info);
    }
  });
};
