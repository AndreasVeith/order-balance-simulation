import mongoose from "mongoose";

export const conntect_db = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_SERVER_URL as string);
    } catch (error) {
        console.error("DB Connection Failed", error);
    }
};

export const disconntect_db = async () => {
    try {
        await mongoose.disconnect();
    } catch (error) {
        console.error("DB Disconnection Failed", error);
    }
};
