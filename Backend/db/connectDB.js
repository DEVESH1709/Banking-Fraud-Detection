import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Mongodb is connected ${conn.connection.host}`)
  } catch (error) {
    console.log(`Error connection to mongodb: ${error.message}`);
    process.exit(1); // failure, 0 is success
  }  
}
