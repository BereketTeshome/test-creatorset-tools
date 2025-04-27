import mongoose from "mongoose";

export async function connectDb() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    const connection = conn.connection;
    connection.on("connected", () => {
      console.log("MongoDB connected", connection.db.databaseName);
    });
    connection.on("error", (err) => {
      console.log(err);
    });
  } catch (error) {
    console.log(error);
  }
}
