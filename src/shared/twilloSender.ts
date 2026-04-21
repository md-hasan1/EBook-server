import httpStatus from "http-status";
import ApiError from "../errors/ApiErrors";

export const twilioSender = async (phoneNumber: string, otp: string) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

  if (!accountSid || !authToken || !messagingServiceSid) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Twilio credentials not configured"
    );
  }

  const client = require("twilio")(accountSid, authToken);

  const whatsappTo = `whatsapp:${phoneNumber}`;
  const smsTo = phoneNumber;
  const otpBody = `Your OTP is ${otp}. Please use this code to verify your account. It expires in 10 minutes.`;

  try {
    const whatsappMessage = await client.messages.create({
      messagingServiceSid: messagingServiceSid,
      to: whatsappTo,
      body: otpBody,
    });
    console.log("WhatsApp OTP sent. SID:", whatsappMessage.sid);
  } catch (error: any) {
    console.error("WhatsApp failed:", error.message);
  }

  try {
    const smsMessage = await client.messages.create({
      messagingServiceSid: messagingServiceSid,
      to: smsTo,
      body: otpBody,
    });
    console.log("SMS OTP sent. SID:", smsMessage.sid);
  } catch (error: any) {
    console.error("SMS failed:", error.message);
  }
};