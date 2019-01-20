require("dotenv").config();

import { app, server } from "./app";

app.set("port", process.env.PORT || 3000);

server.listen(app.get("port"), () =>
  console.log(`Server running on port ${app.get("port")}`)
);
