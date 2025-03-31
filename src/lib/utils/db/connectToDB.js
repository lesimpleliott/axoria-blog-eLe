import mongoose from "mongoose";

const connectToDB = async () => {
  if (mongoose.connection.readyState) {
    console.log("Already connected to the database:", mongoose.connection.name);
    return 
  } 
  try { 
    await mongoose.connect(process.env.MONGO)
    console.log("Connected to the database:", mongoose.connection.name);
  } catch (err) {
    throw new Error("Failed to connect to the database");
  }
}

export default connectToDB;
