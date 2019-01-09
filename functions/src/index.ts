import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
import nodemailer = require('nodemailer');
const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(`smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);
const mailOptions = {
    to: 'test@example.com',
    subject: 'Information Request from ',
    html: 'val.html'
  };
exports.sendContactMessage = mailTransport.sendMail(mailOptions).then(
    () => {
        console.log("Mail sent to contact");
    }

)
