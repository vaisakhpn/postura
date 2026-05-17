import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database Connected");
    });

    mongoose.connection.on("error", (err) => {
      console.log("MongoDB Error:", err.message);
    });

    await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 30000,
    });

  } catch (error) {
    console.log("Database connection failed");
    console.log(error.message);

    // Retry after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;