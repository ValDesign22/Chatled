import type { NextApiRequest, NextApiResponse } from 'next';
import mongoConnect from '../../../lib/mongoConnect';
import users from '../../../models/users';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongoConnect();

    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const { username, email, password } = req.body;

    if (!username || !email || !password) return res.status(400).end();

    const user = await users.findOne({ email });

    if (user) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const code = generateConfirmCode();
    const id = generateId();

    new users({
        id: id,
        username,
        email,
        password: encode(password),
        createdAt: new Date(),
        updatedAt: new Date(),
        confirmed: 'Pending',
        confirmCode: code
    }).save();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_SECRET
        }
    });

    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: email,
        subject: 'Confirm your email',
        html: `<div style="text-align: center; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">
            <h1>Hello, ${username}!</h1>
            <p>Thank you for registering on our website. Please confirm your email by clicking the button below.</p>
            <a href="${process.env.APP_URL}/app/confirm/${id}" style="text-decoration: none; color: white; background-color: #000; padding: 1rem 2rem; border-radius: 0.5rem;" target="_blank">Confirm</a>

            <p style="margin-top: 1rem;">If you didn't register on our website, please ignore this email.</p>

            <p style="margin-top: 1rem;">Your confirmation code: <span style="font-weight: bold;">${code}</span></p>

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

    return res.status(200).end();
}

function generateId() {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let id = '';

    for (let i = 0; i < 15; i++) {
        id += letters[Math.floor(Math.random() * letters.length)];
    }

    return id;
}

function generateConfirmCode() {
    const numbers = '0123456789';

    let code = '';

    for (let i = 0; i < 6; i++) {
        code += numbers[Math.floor(Math.random() * numbers.length)];
    }

    return code;
}

function encode(data: string) {
    const buff = Buffer.from(data);
    const base64data = buff.toString('base64');

    return base64data;
}
