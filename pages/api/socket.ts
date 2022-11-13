import type { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'socket.io';
import {User, Message, Room} from "../../utils/interfaces";
import axios from "axios";

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

            socket.on('messageSent', (data: { user: User, message: string, room: Room }) => {
                const request = axios.post(`${process.env.APP_URL}/api/rooms/messages`, data);

                request.then((response) => {
                    const messagesUpdate = response.data.messages;

                    socket.broadcast.emit('messageReceived', ({ messages: messagesUpdate }));
                });
            });
        });
    }
    res.end()
}
