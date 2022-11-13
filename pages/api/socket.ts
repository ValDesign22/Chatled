import type { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'socket.io';
import {User} from "../../utils/interfaces";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // @ts-ignore
    if (!res.socket.server.io)  {
        // @ts-ignore
        const io = new Server(res.socket.server)
        // @ts-ignore
        res.socket.server.io = io

        io.on('connection', socket => {
            socket.on('typing', (data: { user: User }) => {
                socket.broadcast.emit('typing', data);
            });

            socket.on('stopTyping', (data: { user: User }) => {
                socket.broadcast.emit('stopTyping', data);
            });
        });
    }
    res.end()
}
