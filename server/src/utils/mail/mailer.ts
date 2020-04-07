import nodemailer from 'nodemailer';
import { User } from '../../entity/User';
import { confirmationHtml } from './templates/confirmation';
import { passwordResetHtml } from './templates/password-reset';

export const sendPasswordResetMail = async (user: User, token: string) => {
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

  return await transporter
    .sendMail(message)
    .then(r => {
      return true;
    })
    .catch(e => {
      return false;
    });
};

export const sendConfirmationMail = async (user: User, token: string) => {
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

  let mailSent;

  transporter
    .sendMail(message)
    .then(s => {
      mailSent = true;
      return true;
    })
    .catch(r => {
      mailSent = false;
      return false;
    });

  // console.log(mailSent);
  // return mailSent;
};
