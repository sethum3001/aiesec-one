import mongoose from "mongoose";

const connection: { isConnected?: number } = {};

async function dbConnect() {
  //If connected return
  if (connection.isConnected) {
    return;
  }
  //Connect mongodb
  const db = await mongoose.connect(process.env.MONGODB_URI!);
  //Update connection state
  connection.isConnected = db.connections[0].readyState;
}

export default dbConnect;
