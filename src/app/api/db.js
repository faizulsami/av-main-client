import mongoose from "mongoose";

const connectMongoDB = async () => {
  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  }

  try {
    const dbUri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;

    // Connect to MongoDB with database name specified
    await mongoose.connect(dbUri, {
      dbName,
    });

    console.log(`Connected to MongoDB database: ${dbName}`);
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err;
  }
};

export default connectMongoDB;
