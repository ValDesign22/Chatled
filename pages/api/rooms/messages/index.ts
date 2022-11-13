import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "../../../../lib/mongoConnect";
import rooms from "../../../../models/rooms";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongoConnect();

    if (req.method === "POST") {
        const { message, user, room } = req.body;

        if (!message || !user || !room) res.json({ error: "Missing content, user or room" });

        const roomData = await rooms.findOne({ id: room.id });

        if (!roomData) res.json({ error: "Room not found" });

        roomData.messages.push({
            id: Date.now().toString(),
            text: message,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            user: {
                id: user.id,
                username: user.username,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            room: room.id
        });

        await roomData.save();

        const updatedRoom = await rooms.findOne({ id: room.id });

        res.json(updatedRoom);
    }

    if (req.method === "GET") {
        const { room } = req.query as { room: string };

        if (!room) res.json({ error: "Missing room" });

        const roomData = await rooms.findOne({ id: room });

        if (!roomData) res.json({ error: "Room not found" });

        res.json(roomData.messages);
    }
}