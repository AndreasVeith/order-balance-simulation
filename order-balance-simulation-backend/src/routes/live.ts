import { Response, Request, NextFunction, Router } from "express";
import binanceApiNode from "binance-api-node";
import Order from "../models/order";
import { conntectAMQPServer, sendMessageToQueue } from "../brokers/rabbitmq";

const client = binanceApiNode();
const tickers = ["BTCUSDT", "ETHBTC", "LTCUSDT", "XRPUSDT"];
function handleTickerUpdate(ticker: any) {
    let symbol = ticker.symbol.toLowerCase();
    let price = parseFloat(ticker.curDayClose);
    Order.updateMany({ symbol, price: { $gte: price - 0.01, $lte: price + 0.01 }, status: 0 }, { status: 1, completed: Date() })
        .then((res) => {
            if (res.modifiedCount > 0) {
                console.log(res.upsertedId);
                sendMessageToQueue(res.upsertedId);
                sendEventsToAll(true);
            }
        })
        .catch((err) => {
            console.error(err);
        });
}
tickers.forEach((ticker) => {
    client.ws.ticker(ticker, handleTickerUpdate);
});

const router = Router();

let clients: Array<any> = [];
function sendEventsToAll(event: any) {
    clients.forEach((client) => client.response.write(`data: ${JSON.stringify(event)}\n\n`));
}

router.get("/", (request: Request, response: Response, next: NextFunction) => {
    const headers = {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
    };
    response.writeHead(200, headers);
    const data = `data: ${JSON.stringify(false)}\n\n`;
    response.write(data);

    const clientId = Date.now();
    const newClient = {
        id: clientId,
        response,
    };
    clients.push(newClient);
    request.on("close", () => {
        clients = clients.filter((client) => client.id !== clientId);
    });
});

export default router;
