const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            maxPoolSize: 10, // Number of connections in the pool
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
          });
        console.log("😎✌️  MongoDB Connected Successfully!");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1); // Exit the process if connection fails to prevent the server from starting 
    }
};

// Export the function to use in other files
module.exports = connectDB;
