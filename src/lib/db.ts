import mongoose from "mongoose";

const connectMongoDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  }

  try {
    const dbUri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;

    if (!dbUri) {
      throw new Error(
        "MONGODB_URI is not defined in the environment variables",
      );
    }

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
