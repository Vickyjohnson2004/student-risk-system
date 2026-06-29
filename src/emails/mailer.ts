import nodemailer from 'nodemailer';
import config from '../config';

const transporter = nodemailer.createTransport({
  host: config.emailHost,
  port: config.emailPort,
  auth: { user: config.emailUser, pass: config.emailPass }
});

export async function sendVerificationEmail(email: string, name: string) {
  await transporter.sendMail({
    from: 'no-reply@uniport.edu',
    to: email,
    subject: 'Verify your UniPort account',
    html: `<p>Hi ${name},</p><p>Thank you for registering with UniPort. Please verify your email address from your dashboard.</p>`
  });
}

export async function sendPasswordReset(email: string, token: string) {
  await transporter.sendMail({
    from: 'no-reply@uniport.edu',
    to: email,
    subject: 'UniPort password reset',
    html: `<p>Use this link to reset your password:</p><p><a href="${config.frontendUrl}/reset-password?token=${token}">Reset password</a></p>`
  });
}

export async function sendRiskNotification(email: string, studentName: string, riskLevel: string) {
  await transporter.sendMail({
    from: 'no-reply@uniport.edu',
    to: email,
    subject: 'High risk notification',
    html: `<p>Student ${studentName} has been identified as ${riskLevel}. Please review the recommendation report.</p>`
  });
}
