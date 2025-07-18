const nodemailer = require("nodemailer");

exports.sendMail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.TRANSPORTER_EMAIL,
      pass: process.env.TRANSPORTER_PASSWORD,
    },
  });

  transporter
    .verify()
    .then(() => console.log("Mail server ready.."))
    .catch((err) => console.error("❌ Mail server error:", err));
  const mailOptions = {
    from: `"📦 CourierTracker" <${process.env.TRANSPORTER_EMAIL}>`,
    to,
    subject,
    html,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent to", to);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("❌ Failed to send email to", to, error);
    return null;
  }
};
