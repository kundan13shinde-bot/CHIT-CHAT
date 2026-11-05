import mongoose from "mongoose";

export     async function ConnectDB() {
    try {
        const mongoUri = process.env.MONGO_URI

        if(!mongoUri){
            throw new Error("MONGO_URI is required")
        }

       const connectDB =  await mongoose.connect(mongoUri)
        console.log("MongoDB connected", connectDB.connection.host);
    }
    catch(error){
        console.log("MongoDB connection error", error.message);
        process.exit(1);
    }
}