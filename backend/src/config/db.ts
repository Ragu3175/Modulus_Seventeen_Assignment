import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Node.js SRV record lookup on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore if not permitted
}

/**
 * MongoDB Database Connection Manager
 * Handles connection lifecycle, event listeners, and provides graceful fallback
 */
export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/modulus_todo_app';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error: any) {
    console.warn(`[Database Warning] Could not connect to local MongoDB (${error.message}).`);
    console.warn(`[Database Info] Please ensure MongoDB is running or configure MONGODB_URI in backend/.env`);
    console.warn(`[Database Info] The server will still boot to allow testing and health check responses.`);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[Database] MongoDB disconnected');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`[Database Error] ${err.message}`);
  });
};
