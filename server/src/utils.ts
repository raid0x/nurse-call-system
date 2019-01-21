import * as WebSocket from "ws";
import { existsSync } from "fs";
import { resolve } from "path";
import { getDay, getTime, startOfDay } from "date-fns";

import { Block, Dispatch, DelayedDispatch } from "./interfaces";

function getTimeFrame(date: Date): number {
  const startOfDayTime = startOfDay(date).getTime();
  const currentTime = getTime(date);

  return Math.floor((currentTime - startOfDayTime) / 900000);
}

function getCurrentBlock(
  dayOfWeek: number,
  timeFrame: number
): (b: Block) => boolean {
  return function(block: Block): boolean {
    return (
      block.days.includes(dayOfWeek) && block.timeFrame.includes(timeFrame)
    );
  };
}

function newMessage(action: string): (a: string) => string {
  return function(message: string) {
    return `${action} ${message}`;
  };
}

function minutesToMiliseconds(minutes: number): number {
  return minutes * 60 * 1000;
}

function createDelayedDispatches(
  targets: string[],
  action: string,
  minutesDelayed: number
): DelayedDispatch[] {
  return targets.map(target => ({
    dispatch: newMessage(action)(target),
    delay: minutesToMiliseconds(minutesDelayed)
  }));
}

function generateDispatches(
  schedule: Block[],
  now: Date,
  message: string
): Dispatch {
  const result: Dispatch = {
    dispatches: [],
    delayedDispatches: []
  };

  const [action, target] = message.split(" ");

  if (
    action == "deactivate" ||
    action == "deactivated" ||
    action == "activated"
  ) {
    result.dispatches = [message];
    return result;
  }

  const dayOfWeek = getDay(now);
  const timeFrame = getTimeFrame(now);
  const [currentBlock] = schedule.filter(getCurrentBlock(dayOfWeek, timeFrame));

  if (currentBlock.active.includes(target)) {
    result.dispatches = [message];
  } else if (target == "white") {
    result.dispatches =
      currentBlock.active.length == 3
        ? [message]
        : currentBlock.active.map(newMessage(action));
  } else {
    result.dispatches = currentBlock.active.map(newMessage(action));
  }

  result.delayedDispatches.push(
    ...[
      ...createDelayedDispatches(
        currentBlock.active.filter(
          target => !result.dispatches.includes(`${action} ${target}`)
        ),
        action,
        1
      ),
      ...createDelayedDispatches(currentBlock.delay["5"], action, 5),
      ...createDelayedDispatches(currentBlock.delay["15"], action, 15)
    ]
  );

  return result;
}

function sendDispatchToClient(
  wss: WebSocket.Server,
  ws: WebSocket,
  dispatch: string
) {
  wss.clients.forEach(client => {
    if (client != ws && client.readyState == WebSocket.OPEN) {
      client.send(dispatch);
    }
  });
}

export { generateDispatches, sendDispatchToClient };
