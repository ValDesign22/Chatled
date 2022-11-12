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

    console.log(user);

    if (user.confirmed === "Active") return res.status(200).redirect('/app/login');

    console.log(user.confirmCode, code);
    console.log(user.confirmCode === code);

    if (user.confirmCode === code) {
        console.log('Code is correct');
        user.confirmed = "Active";
        user.save();
        return res.status(200).redirect(`${process.env.APP_URL}/app/login`);
    } else return res.status(400).json({ error: "Invalid code" });
}