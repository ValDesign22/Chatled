import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { sign } from 'jsonwebtoken';
import mongoConnect from '../../../lib/mongoConnect';
import users from '../../../models/users';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongoConnect();

    const { email, password } = req.body;

    if (!email || !password) return res.status(400).end();

    const user = await users.findOne({ email: email });

    if (!user) return res.status(404).end();

    if (user.confirmed !== "Active") return res.status(403).redirect(`/app/confirm/${user.id}`);

    const decodedPassword = decode(user.password);

    if (decodedPassword !== password) return res.status(401).end();

    const token = sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1w' });

    res.setHeader('Set-Cookie', serialize(process.env.COOKIE_NAME!, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 604800,
        path: '/',
    }));

    res.status(200).redirect('/app');
}

function decode(data: string) {
    return Buffer.from(data, 'base64').toString('ascii');
}