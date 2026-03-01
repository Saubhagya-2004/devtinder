const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "smtgugul@gmail.com",
        pass: "dqgq umjg aasy xaxz",
    }
});

console.log("Attempting to connect to Gmail...");

transporter.verify(function (error, success) {
    if (error) {
        console.error("CONNECTION ERROR:");
        console.error(error);
        process.exit(1);
    } else {
        console.log("Server is ready to take our messages!");
        process.exit(0);
    }
});
