import { config } from "dotenv";

import { app, server } from "./app";

config();

app.set("port", process.env.PORT || 3000);

server.listen(app.get("port"), () =>
  console.log(`Server running on port ${app.get("port")}`)
);
