import "dotenv/config";
import { Resend } from "resend";
import { createWelcomeEmailTemplate } from "./emailTemplates";

// * Instantiated resend client
const client = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeMail = async (
  email: string,
  name: string,
  clientURL: string,
) => {
  const { data, error } = await client.emails.send({
    from: process.env.EMAIL_FROM_NAME,
    to: email,
    replyTo: process.env.REPLY_TO,
    subject: "Welcome to Chatify!",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) {
    console.error("Error sending welcome email: ", error);
    throw new Error("Failed to send welcome email");
  }

  console.log("Welcome Email sent successfully", data);
};
