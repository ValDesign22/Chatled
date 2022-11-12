import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "../../../lib/mongoConnect";
import users from "../../../models/users";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongoConnect();

    const { id } = req.query;

    const user = await users.findOne({ id: id });

    res.status(200).json(user);
}