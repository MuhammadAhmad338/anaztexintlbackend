const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: "email-smtp.eu-north-1.amazonaws.com", // change region if needed
        port: 587,
        secure: false, // true for 465
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
    });

    const mailOptions = {
        from: "ahmadmuhammad.7700@gmail.com",
        to: "ahmadmuhammad.7700@gmail.com",
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