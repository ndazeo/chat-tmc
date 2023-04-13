import type { Server as HTTPServer } from 'http'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Socket as NetSocket } from 'net'
import type { Server as IOServer } from 'socket.io'
import { Server } from 'socket.io'

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined
}

interface SocketWithIO extends NetSocket {
  server: SocketServer
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO
}
export default function SocketHandler(
    req: NextApiRequest,
    res: NextApiResponseWithSocket
)
{  
    if (!res.socket){
        console.log("error")
        res.end()
        return
    }
    if (res.socket.server.io) {
        console.log('Socket is already running')
    } else {
        console.log('Socket is initializing')
        let io = new Server(res.socket.server)
        //io = io.path("/api/socket")
        io.on('connection', socket => {
          socket.broadcast.emit('a user connected')
          socket.on('hello', msg => {
            socket.emit('hello', 'world!')
          })
        })
        res.socket.server.io = io
    }
    console.log(res.socket.server.io.path())
    res.end()
}

export const config = {
  api: {
    bodyParser: false
  }
}