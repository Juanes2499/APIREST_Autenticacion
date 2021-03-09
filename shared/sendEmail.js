var nodemailer = require('nodemailer');

const sendEmail = (to, subject, body, callback) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });
    
    var mailOptions = {
        from: process.env.MAIL_USER,
        to: to,
        subject: subject,
        text: body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error)
            return callback(false);
        }
        
        return callback(true);
    });
}


module.exports = sendEmail;