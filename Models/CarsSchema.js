const mongoose = require('mongoose');

const CarsSchema = new mongoose.Schema({
  brand: 
  { type: String, 
    required: true 
  }, // Brand (e.g., Toyota, Honda)
  model: 
  { type: String, 
    required: true 
  }, // Model (e.g., Corolla, Civic)
  year: 
  { 
    type: Number, 
    required: true 
  }, // Manufacturing year
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
    required: true 
  }, // Fuel type
  transmission: 
  { type: String, 
    enum: ["Manual", "Automatic"], 
    required: true 
  }, // Gearbox type
  condition: 
  { type: String, 
    enum: ["New", "Used"], 
    required: true 
  }, // Car condition
  location: 
  { type: String, 
    required: true 
  }, // Seller location
  sellerContact:
   {
    name: {
       type: String, 
       required: true 
      },
    phone: 
    { 
      type: String, 
      required: true 
    },
    email: 
    { type: String, 
      required: true 
    }
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