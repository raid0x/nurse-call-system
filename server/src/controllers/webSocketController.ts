import * as WebSocket from "ws";

import { Dispatch } from "../interfaces";
import { generateDispatches, sendDispatchToClient } from "../utils";
import { schedule } from "../schedule";

let delayedDispatchIDs: NodeJS.Timeout[] = [];

function handleWebSockets(wss: WebSocket.Server): (w: WebSocket) => void {
    return function(ws: WebSocket) {
      ws.send("identify");
      let identity = "new user";
      console.log("A new user connected");

      let dinger = setInterval(() => {
        ws.send("ding");
      }, 30 * 1000);

      ws.on("message", function(message: string) {
        console.log(identity + " - Message recieved: " + JSON.stringify(message));
        
        const [ command, device ] = message.split(" ");

        if (command === "identity") {
          identity = device;
          console.log('new user identified as ' + identity);
          return;
        }

        if (message == "deactivate") {
          delayedDispatchIDs.forEach(timerID => clearTimeout(timerID));
          delayedDispatchIDs = [];
        }

        const { dispatches, delayedDispatches }: Dispatch = generateDispatches(
          schedule,
          new Date(),
          message
        );

        dispatches.forEach(dispatch => {
          sendDispatchToClient(wss, ws, dispatch);
        });

        delayedDispatches.forEach(({ dispatch, delay }) => {
          const timerID = setTimeout(function() {
            sendDispatchToClient(wss, ws, dispatch);
          }, delay);

          delayedDispatchIDs.push(timerID);
        });
      });

      ws.on("close", function() {
        console.log(identity + " disconnected.");
        clearInterval(dinger);
      });
  };
}

export { handleWebSockets };
