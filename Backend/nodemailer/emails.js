import { sendEmail } from "./nodemailer.config.js";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationCode) => {
  // const recipent = [{ email }];
  try {
    const response = await sendEmail(
      email,
      "Verify Your Email",
      VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationCode
      )
    );

    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
  }
};

export const sendWelcomeEmail = async (email, name) => {
  // const recipent = [{ email }];

  try {
    const response = await sendEmail(
      email,
      "Welcome to Auth V1",
      WELCOME_EMAIL_TEMPLATE.replace("{name}", name)
    );

    console.log("Welcome email sent successfully:", response);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
};

export const sendResetPasswordEmail = async (email, resetURL) => {
  // const recipent = [{ email }];

  try {
    const response = await sendEmail(
      email,
      "Reset Your Password",
      PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL)
    );

    console.log("Password reset email sent successfully:", response);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

export const sendResetSuccessEmail = async (email) => {
  // const recipent = [{ email }];

  try {
    const response = await sendEmail(
      email,
      "Password Reset Successful",
      PASSWORD_RESET_SUCCESS_TEMPLATE
    );

    console.log("Password reset success email sent successfully:", response);
  } catch (error) {
    console.error("Error sending password reset success email:", error);
    throw new Error("Failed to send password reset success email");
  }
};
