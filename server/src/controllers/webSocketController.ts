import * as WebSocket from "ws";

import { Dispatch } from "../interfaces";
import { generateDispatches, sendDispatchToClient } from "../utils";
import { schedule } from "../schedule";

let delayedDispatchIDs: NodeJS.Timeout[] = [];

function handleWebSockets(wss: WebSocket.Server): (w: WebSocket) => void {
  return function(ws: WebSocket) {
    console.log("A new user connected");

    ws.on("message", function(message: string) {
      console.log("Message recieved: " + JSON.stringify(message));

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
      console.log("A user disconnected.");
    });
  };
}

export { handleWebSockets };
