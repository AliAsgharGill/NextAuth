import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: Date.now() + 3600000,
      });
    }

    const transporter = require("nodemailer");

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "0e214c031e0368",
        pass: "17d36f42d84eb3",
      },
    });

    // const transporter = nodemailer.createTransport({
    //   host: "smtp.ethereal.email",
    //   port: 587,
    //   secure: false, // Use `true` for port 465, `false` for all other ports
    //   auth: {
    //     user: "maddison53@ethereal.email",
    //     pass: "jn7jnAPss4f63QBp6D",
    //   },
    // });

    const mailOptions = {
      from: "stylinalivlgos@gmail.com", // sender address
      to: "email", // list of receivers
      subject: emailType === "VERIFY" ? "Verify Email" : "Reset Password", // Subject line
      //   text: "Hello world?", // plain text body/
      html: `<p>Click <a href="${
        process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${
        emailType === "VERIFY" ? "verify" : "reset"
      } OR copy and paste link in browser <br> </p>`,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", mailResponse.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(mailResponse));
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
