import bcrypt from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/user.model.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { evaluateContext } from "../utils/contextEvaluator.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendResetSuccessEmail,
} from "../nodemailer/emails.js";
import { updateContextProfile } from "../utils/updateContextProfile.js";

export const signup = async (req, res) => {
  const { email, password, name, context } = req.body;
  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required!");
    }

    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User Already Exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationCode();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      trustedIPs: [context.ip], // Initialize with the current IP
      trustedDevices: [context.device], // Initialize with the current device
      locations: [
        {
          lat: context.location.latitude,
          lon: context.location.longitude,
        },
      ], // Initialize with the current location
      contextLogs: [
        {
          ip: context.ip,
          device: context.device,
          location: {
            lat: context.location.latitude,
            lon: context.location.longitude,
          },
          timestamp: new Date(),
          riskScore: 0, // Initial risk score for this context
        },
      ],
      behavioralProfile: {
        typingSpeed: context.typingSpeed,
        loginHours: context.loginHours,
      }, // Initialize with the current behavioral profile
      riskScore: 0, // Initialize risk score
    });

    await user.save();
    
    // jwt
    generateTokenAndSetCookie(res, user._id);

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { verificationCode } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: verificationCode,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error verifying email:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email is required!",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found!" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();
    // Here you would send the reset token to the user's email
    sendResetPasswordEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset token sent to your email",
    });
  } catch (error) {
    console.log("Error during forgot password:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    if (!newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "New password is required!" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    sendResetSuccessEmail(user.email);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log("Error during reset password:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password, context } = req.body;
  try {
    if (!email || !password) {
      throw new Error("All fields are required!");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentails!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong Password!" });
    }

    try {
      const risk = evaluateContext(context, user);
      // if (risk >= 5) {
      //   return res
      //     .status(403)
      //     .json({ error: "Suspicious activity, login blocked" });
      // } else if (risk >= 4) {
      //   return res
      //     .status(200)
      //     .json({ message: "2FA required", require2FA: true });
      // }
      // const risk = 0;
      user.lastLogin = new Date();
      await updateContextProfile(user, context, risk);
      await user.save();
    } catch (error) {
      console.error("Error evaluating context:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
        contextLogs: undefined,
        trustedIPs: undefined,
        trustedDevices: undefined,
        locations: undefined,
        behavioralProfile: undefined,
        riskScore: undefined,
      },
    });
  } catch (error) {
    console.log("Error during login:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error checking authentication:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
