import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

  const mailOptions = {
    from: `"Social App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email - Social App",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h2 style="color: #4f46e5;">Welcome to Social App! 🎉</h2>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${verifyUrl}" 
           style="display: inline-block; background: #4f46e5; color: white; 
                  padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 20px 0;">
          Verify Email
        </a>
        <p style="color: #666;">If you didn't create an account, you can ignore this email.</p>
        <p style="color: #666; font-size: 12px;">This link expires in 24 hours.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
