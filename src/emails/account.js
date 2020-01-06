const sgMail = require('@sendgrid/mail');

console.log(process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
sgMail.send({
    to: 'shanecunneen@hotmail.com',
    from: 'shanecunneen1@gmail.com',
    subject: 'Test Email',
    text: 'Hello Shane'
});