import * as React from "react";

import { env } from "../../../config";

class DisableButton extends React.Component<{}, { socket: WebSocket }> {
  constructor(props) {
    super(props);

    this.state = { socket: new WebSocket(env.webSocketUrl) };
  }

  componentWillUnmount() {
    this.state.socket.close();
  }

  render() {
    const { socket } = this.state;

    return (
      <button type="button" onClick={() => socket.send("deactivate")}>
        DISABLE
      </button>
    );
  }
}

export default DisableButton;
