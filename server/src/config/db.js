import dns from "node:dns";
import mongoose from "mongoose";

// Router DNS Node.js-এর SRV request refuse করছে,
// তাই MongoDB Atlas lookup-এর জন্য public DNS ব্যবহার করছি।
dns.setServers(["8.8.8.8", "8.8.4.4"]);

export async function connectDB() {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `MongoDB connected: ${connection.connection.host}`
    );
  } catch (error) {
    console.error(
      `MongoDB connection failed: ${error.message}`
    );

    process.exit(1);
  }
}