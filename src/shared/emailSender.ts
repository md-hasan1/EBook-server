import nodemailer from "nodemailer";

export const emailSender = async (
  to: string,
  html: string,
  subject: string
) => {
  try {
    console.log("Sending email to:", to);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 2525,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to,
      subject,
      text: html.replace(/<[^>]+>/g, ""),
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(info);
    return info.messageId;
  } catch (error) {
    throw new Error("Failed to send email. Please try again later.");
  }
};