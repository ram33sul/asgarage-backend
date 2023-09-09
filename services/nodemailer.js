import nodemailer from 'nodemailer'

export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}


export function sendOTP(email, otp) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP for email verification is: ${otp}`,
    }

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              reject(error)
            } else {
              resolve(true)
            }
        });
    })

}