import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
console.log("MONGODB_URI", MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

let cachedConn: typeof mongoose | null = null;
let cachedPromise: Promise<typeof mongoose> | null = null;

export async function connectToDatabase() {
  if (cachedConn) {
    return cachedConn;
  }

  if (!cachedPromise) {
    const opts = {
      bufferCommands: false,
    };

    cachedPromise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cachedConn = await cachedPromise;
  } catch (e) {
    cachedPromise = null;
    throw e;
  }

  return cachedConn;
}
