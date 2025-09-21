import nodemailer from "nodemailer";
import { Api500Error } from "../errors/errors.js";
import { CONSTANTS } from "./constants.js";
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config()
let transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true, // use SSL
    auth: {
        user: 'abhayparja90@gmail.com',
        pass: 'vmsajvchgkadrxja'
    },
});
transporter.verify((error, success) => {
    if (error) console.log("SMTP Error:", error);
    else console.log("Server ready to send emails");
});
const sendMail = async (mailoption) => {
    try {
        const info = await transporter.sendMail(mailoption)
        console.log(info)
    } catch (error) {
        console.log(error)
        throw new Api500Error('Mail-Error')
    }
}

export default {
    sendOtp: (email, otp, subject) => {
        var mailOptions = {
            from: process.env.EMAIL_SMTP,
            to: email,
            subject,
            html: `<h1>Your otp is ${otp}</h1>`
        };
        sendMail(mailOptions);
    },
    mailSend: async (emailRequest) => {
        try {
            var subject;
            var mailMessage;
            var emailTemplate;
            if (emailRequest.template === CONSTANTS.USERS.VERIFYOTP) {
                subject = 'Verify OTP';
                emailTemplate = './templates/Welcome.html';
            }
            if (emailTemplate) {
                const result = await readFile(emailTemplate);
                mailMessage = result.replace(/{email}/g, emailRequest?.data?.email);
                mailMessage = mailMessage.replace(/{firstName}/g, emailRequest?.data?.name);
                mailMessage = mailMessage.replace(/{otp}/g, emailRequest?.data?.otp);
                mailMessage = mailMessage.replace(/{expiryMinutes}/g, 2);
                var mailOptions = {
                    from: process.env.EMAIL_SMTP,
                    to: emailRequest.to,
                    subject: subject,
                    html: mailMessage
                };
                await sendMail(mailOptions);

                async function readFile(file) {
                    try {
                        const data = await fs.promises.readFile(file, 'utf8');
                        return data;
                    } catch (error) {
                        // console.log()
                        console.log(error);
                        throw new Api500Error("read-email-template-error")
                    };
                };
            }
        } catch (error) {
            throw error
        }
    }
};