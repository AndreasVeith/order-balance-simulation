import amqp, { Channel, Connection } from "amqplib";

let channel: Channel;
let connection: Connection;

export const conntectAMQPServer = async () => {
    try {
        connection = await amqp.connect(process.env.CLOUD_AMQP_SERVER_URL as string);
        channel = await connection.createChannel();
        console.log("Successfully connected to AMQP Server.");
    } catch (error) {
        console.error("Error Occured while connecting to server", error);
    }
};

export const sendMessageToQueue = async (data: any) => {
    try {
        await channel.sendToQueue(data.symbol, Buffer.from(JSON.stringify(data)), { persistent: true });
        return true;
    } catch (error) {
        console.error("Error while sending message to queue");
        return false;
    }
};
