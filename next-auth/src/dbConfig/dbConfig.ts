import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;

    // connection.once("open", () => {
    //   console.log("MongoDB database connection established successfully");
    // });

    connection.on("connected", () => {
      console.log("MongoDB database connection established successfully");
    });

    // connection.on("disconnected", () => {
    //   console.log("MongoDB database connection disconnected");
    // });

    connection.on("error", (error) => {
      console.log("MongoDB connection error: ", error);
      process.exit();
    });
  } catch (error) {
    console.log("MongoDB connection error: ", error);
  }
}
