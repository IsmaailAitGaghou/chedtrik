import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Remove deprecated options - they're not needed in Mongoose 6+
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erreur de connexion MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
