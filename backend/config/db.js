import mongoose from 'mongoose';

/**
 * Connect to MongoDB Atlas using Mongoose.
 * Exits process with failure code if URI is invalid or connection fails.
 */
export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (
    !mongoURI ||
    mongoURI === 'your_mongodb_atlas_connection_string' ||
    mongoURI.includes('<username>')
  ) {
    console.error('❌ MONGODB ERROR: Valid MONGO_URI is missing in backend/.env file.');
    console.error('👉 Please update MONGO_URI in backend/.env with your actual MongoDB Atlas connection string.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
