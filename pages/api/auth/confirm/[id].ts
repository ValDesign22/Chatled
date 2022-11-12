import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import mongoConnect from '../../../../lib/mongoConnect';
import users from '../../../../models/users';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongoConnect();

    const { id } = req.query;

    const { code } = req.body;

    const user = await users.findOne({ id: id });

    if (!user) return res.status(404).redirect('/app/register');

    if (user.confirmed === "Active") return res.status(200).redirect('/app/login');

    console.log(user.confirmCode, code);
    console.log(user.confirmCode === code);

    if (user.confirmCode === code) {
        console.log('Code is correct');
        user.confirmed = "Active";
        user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_SECRET
            }
        });

        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: user.email,
            subject: 'Account Confirmed',
            html: `<div style="text-align: center; font-size: 1.5rem; font-weight: 500; margin-bottom: 1rem;">
                <h1>Account Confirmed</h1>
                <p>Your account has been confirmed. You can now login to your account.</p>

                <a href="${process.env.APP_URL}/app/login" style="text-decoration: none; color: white; background-color: #3f51b5; padding: 0.5rem 1rem; border-radius: 0.5rem; margin-top: 1rem;">Login</a>

                <p style="margin-top: 1rem;">If you did not request this email, please ignore it.</p>

                <p style="margin-top: 1rem;">If you have any questions, please contact us at <a href="mailto:${process.env.ADMIN_EMAIL}">${process.env.ADMIN_EMAIL}</a></p>

                <p style="margin-top: 1rem;">Best regards, <br> ${process.env.APP_NAME}</p>

                <p style="margin-top: 1rem;">This email was sent automatically. Please do not reply to it.</p>

                <p style="margin-top: 1rem;">© ${new Date().getFullYear()} ${process.env.APP_NAME}</p>

                <p style="margin-top: 1rem;">${process.env.APP_URL}</p>
            </div>`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) console.log(err);
        });

        return res.status(200).redirect(`${process.env.APP_URL}/app/login`);
    } else return res.status(400).json({ error: "Invalid code" });
}