export interface Block {
  name: string;
  timeFrame: number[];
  days: number[];
  active: string[];
  delay: Delay;
}

export interface Delay {
  "5": string[];
  "15": string[];
}

export interface Dispatch {
  dispatches: string[];
  delayedDispatches: DelayedDispatch[];
}

export interface DelayedDispatch {
  dispatch: string;
  delay: number;
}
