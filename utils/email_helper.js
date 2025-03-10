const nodemailer = require('nodemailer');

const sendEmail = async (mailOptions) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });


      const options ={
        
            from: 'teezyshirt.com', // sender address
            to: mailOptions.email, // list of receivers
            subject: mailOptions.subject, // Subject line
            text: mailOptions.text, // plain text body
      }
      
        // send mail with defined transport object
        const info = await transporter.sendMail(options)
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
      
      

}



module.exports = sendEmail;