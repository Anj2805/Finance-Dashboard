import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDB from "../src/config/db.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    binary: { version: "7.0.3" },        // stable version, caches after first run
    instance: { dbName: "jest_db", args: ["--quiet"], startupTimeoutMS: 30000 } // optional
  });

  // make the URI + secrets available to the app
  process.env.MONGO_URI = mongoServer.getUri();
  process.env.JWT_SECRET = "testsecret";
  process.env.JWT_EXPIRES_IN = "1d";

  await connectDB();
}, 30000); // <-- allow up to 30s for the very first download

afterEach(async () => {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((col) => col.deleteMany({})));
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});
