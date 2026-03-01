const https = require('https');

const postData = JSON.stringify({ email: 'testotpworker@gmail.com' });

const options = {
    hostname: 'devtinder-ltnl.onrender.com',
    port: 443,
    path: '/forgot-password',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = https.request(options, (res) => {
    let data = '';

    console.log(`STATUS: ${res.statusCode}`);

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(`RESPONSE: ${data}`);
    });
});

req.on('error', (e) => {
    console.error(`ERROR: ${e.message}`);
});

req.write(postData);
req.end();
