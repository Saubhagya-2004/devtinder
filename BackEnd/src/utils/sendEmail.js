const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // If no SMTP credentials are provided, log the email to the console (Development Mode)
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
        console.log("\n==========================================================");
        console.log("🚧 MOCK EMAIL PREVIEW (Missing SMTP_EMAIL or SMTP_PASSWORD in .env)");
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: \n${options.message}`);
        console.log("==========================================================\n");
        throw new Error("Missing SMTP credentials in .env"); // Trigger catch block in controller
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // or use host and port for other services
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    // Define the email options
    const mailOptions = {
        from: `DevTinder Support <${process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html, // Optional HTML version of the message
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
