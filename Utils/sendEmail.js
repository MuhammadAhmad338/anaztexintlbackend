const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: "email-smtp.us-east-1.amazonaws.com", // change region if needed
        port: 587,
        secure: false, // true for 465
        auth: {
            user: process.env.SES_SMTP_USER,
            pass: process.env.SES_SMTP_PASS,
        },
    });

    const mailOptions = {
        from: `Anaztex Intl <your_verified_email@yourdomain.com>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: "<h1>Optional HTML</h1>" // optional
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully");
    } catch (error) {
        console.error("❌ Email failed:", error.message);
        throw error;
    }
};

module.exports = sendEmail;