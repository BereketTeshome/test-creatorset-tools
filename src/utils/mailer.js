import User from "@/models/user.models";
import nodemailer from "nodemailer";
import { uuid } from "uuidv4";

export const sendEmail = async ({ email, emailType, userId }) => {
  try {
    const hashedToken = uuid();
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 60 * 60 * 1000, // 1 hour
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: Date.now() + 60 * 60 * 1000, // 1 hour
      });
    } else {
      return new Error("Email type not found");
    }
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "da5d45fa2c256d",
        pass: "dac2b30fc0fb87",
      },
    });
    const mailOptions = {
      from: "sinhasumank41@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your Email" : "Password Reset Email",
      text: "Hello world?",
      html: ` <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Address Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 20px;
        }
        .button {
          display: inline-block;
          background-color: #FF3C47;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          font-weight: bold;
        }
        .footer {
          margin-top: 20px;
          font-size: 14px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <h1>Email Address Verification</h1>
      <p>Hi,</p>
      <p>To finish setting up your account and start using Creatorset, please verify your email address.</p>
      <p>
        <a href="${process.env.PUBLIC_DOMAIN}/verifyemail?token=${hashedToken}" class="button">Verify Email</a>
      </p>
      <p class="footer">This link will expire after 1 hour. Please verify soon.</p>
    </body>
    </html>`,
    };
    const mailRes = await transport.sendMail(mailOptions);
    return mailRes;
  } catch (error) {
    throw new Error(error.message);
  }
};
