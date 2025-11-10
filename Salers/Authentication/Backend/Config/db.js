import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // mongoose.connection.on('connected', () => console.log('Database connected successfully'));
    await mongoose.connect(process.env.MONGO_URI, { dbName: "s_auth" });
    console.log('Database connected successfully');
  } catch (error) {
    console.log(error.message);
  }
};
