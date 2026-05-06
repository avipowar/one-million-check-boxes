import http from "node:http";
import express from "express";
import path from "node:path";
import { Server } from "socket.io";
import { publisher, subscriber, redis } from "./redis-connection.js";

async function main() {
  const app = express();
  const server = http.createServer(app);
  const PORT = process.env.PORT ?? 8000;
  const CHECKB0X_COUNT = 100;

  const CHECKB0X_STATE_KEY = "checkbox-state"

  const state = {
    checkboxes: new Array(CHECKB0X_COUNT).fill(false),
  };

  //socket IO Handler
  const io = new Server();
  io.attach(server);

  subscriber.subscribe("internal-server:checkbox:change")
  subscriber.on("message", (channel, message) => {
    if(channel === "internal-server:checkbox:change"){
        const {index, checked} = JSON.parse(message);
        io.emit("server:checkbox:change", {index, checked})
    }
  })

  io.on("connection", (socket) => {

    console.log(`Socket Connected`, { id: socket.id });

    socket.on("clint:checkbox:change", async (data) => {

      console.log(`[Socket id:${socket.id}]:clint:checkbox:change`, data);

      const existingState = await redis.get(CHECKB0X_STATE_KEY)

      if(existingState) {

        const remoteData = await JSON.parse(existingState)
        remoteData[data.index] = data.checked;

        await redis.set(CHECKB0X_STATE_KEY, JSON.stringify(remoteData))
      }
      else {
        await redis.set(CHECKB0X_STATE_KEY, JSON.stringify(new Array(CHECKB0X_COUNT).fill(false)))
      }

      await publisher.publish(
        "internal-server:checkbox:change",
        JSON.stringify(data),
      );
    });
  });

  // express handler
  app.use(express.static(path.resolve("./public")));

  app.get("/health", (req, res) => {
    res.json({ healthy: true });
  });

  app.get("/checkbox", async(req, res) => {

    const existingState = await redis.get(CHECKB0X_STATE_KEY)

    if(existingState){
      const remoteData = await JSON.parse(existingState)
      return res.json({ checkboxes: remoteData });
    }

    res.json({ checkboxes: new Array(CHECKB0X_COUNT).fill(false)});
  });
  console.log(PORT)
  server.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
  });
}

main();
