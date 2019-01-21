import * as express from "express";
import * as http from "http";
import { resolve } from "path";
import * as WebSocket from "ws";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

import { handleWebSockets } from "./controllers/webSocketController";
import { gzipIfAvailable, setCaching } from "./middleware";

app.use(setCaching);
app.use(gzipIfAvailable);

app.use("/", express.static(resolve(__dirname, "../../client/dist")));
app.use("/mock", express.static(resolve(__dirname, "../assets")));

wss.on("connection", handleWebSockets(wss));

export { app, server };
