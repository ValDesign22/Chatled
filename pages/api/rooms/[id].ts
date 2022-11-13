import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "../../../lib/mongoConnect";
import rooms from "../../../models/rooms";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongoConnect();

    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const { id } = req.query;

    if (!id) return res.json({ error: "Missing id" });

    const room = await rooms.findOne({ id: id as string });

    if (!room) return res.json({ error: "Room not found" });

    res.status(200).json(room);
}