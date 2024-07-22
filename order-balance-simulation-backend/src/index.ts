import path from "path";
import dotenv from "dotenv";
import express from "express";
import orderRouter from "./routes/order";
import cors from "cors";
import liveRouter from "./routes/live";
import { conntect_db } from "./db/config";
import { conntectAMQPServer } from "./brokers/rabbitmq";

async function main() {
    dotenv.config({ path: path.join(__dirname, "../.env") });
    await conntect_db();
    await conntectAMQPServer();
    const app = express();
    app.use(cors());
    app.use(express.urlencoded());
    app.use(express.json());
    app.use("/order", orderRouter);
    app.use("/live", liveRouter);
    app.listen(process.env.SERVER_PORT, () => {
        console.log(`Server running on port ${process.env.SERVER_PORT}`);
    });
}

main();
