import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI!;
  const maxRetries = 5;
  let attempt = 0;

  const connect = async () => {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10,
        autoIndex: process.env.NODE_ENV !== 'production',
      });
      console.log('MongoDB connected successfully');
    } catch (err) {
      attempt++;
      console.error(`MongoDB connection attempt ${attempt} failed:`, (err as Error).message);
      if (attempt < maxRetries) {
        console.log('Retrying MongoDB connection...');
        setTimeout(connect, 5000);
      } else {
        console.error('Max retries reached. Exiting.');
        process.exit(1);
      }
    }
  };

  await connect();

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Attempting reconnect...');
    connect();
  });

  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
  });
};

export default connectDB;
