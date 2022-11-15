import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "../../../lib/mongoConnect";
import users from "../../../models/users";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongoConnect();

    if (req.method === "GET") {
        const { id } = req.query;
    
        const user = await users.findOne({ id: id });
    
        res.status(200).json(user);
    }

    if (req.method === "POST") {
        const { id, type } = req.query;

        if (type === "profilePicture") {
            const { profilePicture } = req.body;
        }

        return res.status(200).json({ message: "Success" });
    }
}