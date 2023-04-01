import nodemailer from 'nodemailer'

export const sendEmail = async ({ to = [], subject, text, html = "" } = {}) => {

    let transporter = nodemailer.createTransport({
        host: "smtp.google.com",
        port: 465,
        secure: true,
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"Node Mailing 📨" <${process.env.EMAIL}>`, // sender address
        to, // list of receivers
        subject, // Subject line
        text, // plain text body
        html, // html body
    });

    return info.rejected.length ? false : true;
}