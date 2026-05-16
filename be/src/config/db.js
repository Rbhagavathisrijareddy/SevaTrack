import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`\n✅ MongoDB connected successfully`);
    console.log(`   Database: ${conn.connection.db.name}`);
    console.log(`   Host: ${conn.connection.host}\n`);
    return conn;
  } catch (error) {
    console.error(`\n❌ MongoDB connection failed:`);
    console.error(`   Error: ${error.message}\n`);
    process.exit(1);
  }
};

export default connectDB;
