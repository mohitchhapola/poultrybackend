const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

const sendEmail = async (subject, message, send_to, send_from, reply_to)=>{
    //create email transporter

    const transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: process.env.EMAIL_HOST,
        auth:{
            user : process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        
    }));

    const options = {
        from: send_from,
        to: send_to,
        replyto : reply_to,
        subject: subject,
        html: message,
    };


    //send mail
    transporter.sendMail(options,function (err,info){
        if(err){
            //            console.log('error in sending the email');
            console.log(err)
        }
        else{
            console.log(info);
        }
    })
};


module.exports = sendEmail;