import mongoose from "mongoose";

mongoose.connect(process.env.DB_CONNECT_STRING);

mongoose.connection.on("open", () => console.log("Connected to db!"));

export default mongoose;
