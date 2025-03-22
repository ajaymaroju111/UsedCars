const mongoose = require('mongoose');

const CarsSchema = new mongoose.Schema({
  brand: 
  { type: String, 
    required: true,
    lowercase: true, // Converts to lowercase
    trim: true
  },
  model: 
  { type: String, 
    required: true,
    lowercase: true, // Converts to lowercase
    trim: true
  }, 
  year: 
  { 
    type: Number, 
    required: true,
    trim : true,
  }, 
  price: 
  { type: Number, 
    required: true 
  }, // Price in USD
  mileage: 
  { type: Number, 
    required: true 
  }, // Mileage in km or miles
  fuelType: 
  { type: String, 
    enum: ["Petrol", "Diesel", "Electric", "Hybrid"], 
    required: true,
    lowercase: true, // Converts to lowercase
    trim: true
  }, // Fuel type
  transmission: 
  { type: String, 
    enum: ["Manual", "Automatic"], 
    required: true 
  }, // Gearbox type
  condition: 
  { type: String, 
    enum: ["New", "Used"], 
    required: true,
    lowercase: true, // Converts to lowercase
    trim: true
  }, // Car condition
  location:
  { 
    type: String, 
    required: true,
    lowercase: true, // Converts to lowercase
    trim: true
  },
  images: 
  {    
    name: String,
    img: {
        data: Buffer, // Binary image data
        contentType: String // Image type (jpeg/png)
    }
  }, 
  description: { 
    type: String 
  }, 
  dateListed: { 
    type: Date, 
    default: Date.now 
  },
  owner_id : {
    type : String,
  }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cars' , CarsSchema);