import * as React from "react";

import { env } from "../../../config";

class DisableButton extends React.Component<{}, { socket: WebSocket }> {
  state = { socket: new WebSocket(env.webSocketUrl) };

  componentWillUnmount() {
    this.state.socket.close();
  }

  handleClick = () => {
    const { socket } = this.state;

    if (socket.readyState != socket.OPEN) {
      this.setState({ socket: new WebSocket(env.webSocketUrl) }, () => {
        const interval = setInterval(() => {
          const { socket } = this.state;

          if (socket.readyState == socket.OPEN) {
            this.state.socket.send("deactivate");
            clearInterval(interval);
          }
        }, 50);
      });
    } else {
      socket.send("deactivate");
    }
  };

  render() {
    return (
      <button type="button" onClick={this.handleClick}>
        DISABLE
      </button>
    );
  }
}

export default DisableButton;
