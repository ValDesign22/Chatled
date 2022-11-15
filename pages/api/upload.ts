import { NextApiRequest, NextApiResponse } from "next";
import users from "../../models/users";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    const { user } = req.query;

    if (!user) return res.status(400).json({ message: "Missing user" });

    const getUser = await users.findOne({ id: user });

    if (!getUser) return res.status(404).json({ message: "User not found" });

    // getUser.avatar = upload.data.link;

    // await getUser.save();

    const updatedUser = await users.findOne({ id: user });

    return res.status(200).json({ message: "Success", user: updatedUser });
}