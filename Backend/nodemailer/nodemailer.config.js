import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const USER = process.env.MAIL_USER;
const PASS = process.env.MAIL_PASS;

export const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: USER,
    pass: PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Auth V1" <${USER}>`, // sender address
      to,
      subject,
      html,
    });
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
