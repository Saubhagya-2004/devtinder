const nodemailer = require('nodemailer');
require('dotenv').config({ path: 'd:/Full-Stack DevTinder/BackEnd/.env' });

async function testEmail() {
    console.log("Testing email with:");
    console.log("Email:", process.env.SMTP_EMAIL);
    console.log("Pass length:", process.env.SMTP_PASSWORD ? process.env.SMTP_PASSWORD.length : 0);

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    try {
        await transporter.verify();
        console.log("Server is ready to take our messages");

        // Optional: send a test email to the same address
        const info = await transporter.sendMail({
            from: process.env.SMTP_EMAIL,
            to: process.env.SMTP_EMAIL,
            subject: "Test Email from DevTinder",
            text: "This is a test email.",
        });
        console.log("Message sent: %s", info.messageId);

    } catch (error) {
        console.error("Error verifying or sending:", error);
    }
}

testEmail();
