const { resendClient, sender } = require("../lib/resend.js");
const { createWelcomeEmailTemplate } = require("./emailTemplates.js");

module.exports.sendWelcomeEmail = async (email, name, clientURL) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome to Vaarta!",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  // RIght now the email will only be send to my gmail as i don't own a domain If someone owns a domain like .in or .com then it will be send to all the person registering...
  if (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }

  console.log("Welcome Email sent successfully", data);
};