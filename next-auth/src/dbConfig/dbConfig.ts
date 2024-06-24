import mongoose from "mongoose";

// here we are connecting to database using mongoose
export async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB database connection established successfully");
    });

    connection.on("disconnected", () => {
      console.log("MongoDB database connection disconnected");
    });

    connection.on("error", (error) => {
      console.log("MongoDB connection error: ", error);
      process.exit();
    });
  } catch (error) {
    console.log("MongoDB connection error: ", error);
  }
}
