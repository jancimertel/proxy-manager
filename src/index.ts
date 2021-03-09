import * as dotenv from "dotenv";
dotenv.config({ path: `./.env.${process.argv[2] || "development"}` });

import server from "./server";

server.start();
