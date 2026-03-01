const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "smtgugul@gmail.com",
        pass: "dqgq umjg aasy xaxz",
    },
});

console.log("Attempting to connect to Gmail...");

transporter.verify(function (error, success) {
    if (error) {
        console.error("CONNECTION ERROR:");
        console.error(error);
        process.exit(1);
    } else {
        console.log("Server is ready to take our messages!");

        const mailOptions = {
            from: "smtgugul@gmail.com",
            to: "smtgugul@gmail.com",
            subject: "Test Render SMTP",
            text: "Does this work?",
        };

        console.log("Sending email...");
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("SEND ERROR:", err);
            } else {
                console.log("EMAIL SENT:", info.response);
            }
            process.exit(0);
        });
    }
});
