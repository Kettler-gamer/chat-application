import "dotenv/config";
import express from "express";
import router from "./src/routes/router.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { onSocketConnection } from "./src/io/ioHandler.js";
import { jwtCheck } from "./src/io/filter/jwtCheck.js";
import { ExpressPeerServer } from "peer";

const app = express();

app.use(express.json());

app.use(router);

const server = createServer(app);
const io = new Server(server);
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

peerServer.on("connection", (peer) => {
  console.log(`${peer.id} Connected`);
});
peerServer.on("disconnect", (peer) => {
  console.log(`${peer.id} Disconnect`);
});

app.use("/peerjs", peerServer);

io.use(jwtCheck);
io.on("connection", onSocketConnection);

server.listen(process.env.PORT, () =>
  console.log("Server is listening on port: ", process.env.PORT)
);
