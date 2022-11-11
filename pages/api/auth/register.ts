import type { NextApiRequest, NextApiResponse } from 'next';
import mongoConnect from '../../../lib/mongoConnect';
import users from '../../../models/users';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongoConnect();

    if (req.method !== 'POST') return res.status(405).end();

    const { username, email, password } = req.body;

    if (!username || !email || !password) return res.status(400).end();

    new users({
        username,
        email,
        password,
        createdAt: new Date(),
        updatedAt: new Date()
    }).save().then(() => res.status(201).end()).catch(() => res.status(500).end());

    return res.status(200).end();
}
