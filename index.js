import http from "node:http";
import express from "express";
import path from "node:path";
import { Server } from "socket.io";

async function main() {
    const app = express();
    const server = http.createServer(app);
    const PORT = process.env.PORT ?? 8000;


    //socket IO Handler
    const io = new Server();
    io.attach(server);

    io.on('connection', (socket)=>{
        console.log(`Socket Connected`, {id: socket.id})

        socket.on("clint:checkbox:change", (data)=>{
            console.log(`[Socket id:${socket.id}]:clint:checkbox:change`, data)

            io.emit("server:checkbox:change", data)
        })
    })


    // express handler
    app.use(express.static(path.resolve("./public")))

    app.get('/health', (req, res) => {
        res.json({healthy: true})
    })

    server.listen(PORT, ()=>{
        console.log(`server is running on https://localhost:${PORT}`)
    })
}


main()