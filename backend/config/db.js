const mongoose = require('mongoose');

const connectDB = async () => {
  // 1. Check for the correct variable name
  if (!process.env.MONGODB_URI) { 
    console.error('❌ Error: MONGODB_URI is undefined. Check your .env file and dotenv config.');
    process.exit(1);
  }

  try {
    // 2. Use the same correct variable name here
    console.log(process.env.MONGODB_URI); // This will now print your connection string
    const conn = await mongoose.connect(process.env.MONGODB_URI); 
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ DB Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;