import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import http from 'http'
import {connectDB} from './lib/db.js'
import userRouter from './routes/userRoute.js'
import messageRouter from './routes/messageRoute.js'
import {Server} from 'socket.io'

const app = express()
const server = http.createServer(app)

//Initialize socket.io server
export const io = new Server(server,{
    cors: {origin: "*"},
    credentials: true
})

//Store online users
export const userSocketMap = {} //{userId: socketId}

//socket.io connection handler
io.on("connection",(socket) => {
    const userId = socket.handshake.query.userId
    console.log("user connected",userId)
    if(userId) userSocketMap[userId] = socket.id

    //Emit online users to all connected clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap))

    socket.on("disconnect",() => {
        console.log("user disconnected",userId)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })

})

//middleware setup
app.use(express.json({limit: "4mb"}))
app.use(cors())

//Routes setup
app.use("/api/status",(req,res) => {
    res.send("Server is live")
})

app.use("/api/auth",userRouter)
app.use("/api/messages",messageRouter)

await connectDB()

const PORT = process.env.PORT || 5000

server.listen(PORT,() => {
    console.log("Server is running" + PORT)
})