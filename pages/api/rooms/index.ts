import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "../../../lib/mongoConnect";
import rooms from "../../../models/rooms";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongoConnect();

    if (req.method === "GET") {
        const list = await rooms.find();

        res.status(200).json(list);
    }
    
    if (req.method === "POST") {
        const { name, owner } = req.body;

        if (!name || !owner) res.json({ error: "Missing name or owner" });

        const list = await rooms.find();

        new rooms({
            id: list.length + 1,
            name,
            owner,
            createdAt: new Date(),
            updatedAt: new Date(),
            users: [],
            messages: []
        }).save();

        res.status(200).json({ success: true, id: list.length + 1 });
    }
}