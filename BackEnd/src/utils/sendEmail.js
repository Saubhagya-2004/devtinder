const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // If no SMTP credentials are provided, log the email to the console (Development Mode)
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
        throw new Error("Missing SMTP credentials in .env"); // Trigger catch block in controller
    }

    // Create a transporter with strict timeouts
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // or use host and port for other services
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
        connectionTimeout: 5000, // Wait maximum 5 seconds to connect
        socketTimeout: 5000,     // Wait maximum 5 seconds for network activity
        greetingTimeout: 5000    // Wait maximum 5 seconds for greeting
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
