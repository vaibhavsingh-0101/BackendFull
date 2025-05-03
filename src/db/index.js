import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { User } from "../models/user.model.js"; // Ensure this path is correct

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`\n✅ MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);

    // 🧹 Drop incorrect index if it exists
    try {
      const indexes = await User.collection.indexes();
      const badIndex = indexes.find((idx) => idx.name === "emial_1");

      if (badIndex) {
        await User.collection.dropIndex("emial_1");
        console.log("🛠 Dropped invalid index: emial_1");
      }
    } catch (indexError) {
      console.error("⚠️ Failed to check/drop invalid index:", indexError.message);
    }

  } catch (error) {
    console.log("❌ MONGODB connection FAILED", error);
    process.exit(1);
  }
};

export default connectDB;
