import nodemailer from 'nodemailer';


// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // or other services like 'smtp', 'mailgun', etc.
    auth: {
        user: `mktkid2023@gmail.com`, // Your email address from environment variable
        pass: `nvrnyitudegjlibb`  // Your email password or app-specific password from environment variable
    }
});

export const Createmessage = async (req, res) => {
    const { to, subject, text,html } = req.body;

    const mailOptions = {
        from:`mktkid2023@gmail.com`, // sender address
        to: to,  // list of receivers
        subject: subject,           // Subject line
        text: text,         // plain text body
        html:html   // html body
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        res.status(200).json({ message: 'Email sent successfully', messageId: info.messageId });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
};
