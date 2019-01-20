import * as express from "express";
import * as http from "http";
import * as path from "path";
import * as WebSocket from "ws";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

import { handleWebSockets } from "./controllers/webSocketController";

app.use("/mock", express.static(path.resolve(__dirname, "../assets")));

wss.on("connection", handleWebSockets(wss));

export { app, server };
