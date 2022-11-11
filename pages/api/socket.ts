import type { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'socket.io';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // @ts-ignore
    if (res.socket.server.io) console.log('Socket is already running')
    else {
      console.log('Socket is initializing')
      // @ts-ignore
      const io = new Server(res.socket.server)
      // @ts-ignore
      res.socket.server.io = io

      io.on('connection', socket => {
        socket.on('typing', msg => {
          socket.broadcast.emit('typing', msg)
        })
      })
    }
    res.end()
}
