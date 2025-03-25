const mongoose = require("mongoose");
const { Buffer } = require("buffer");

const userData = new mongoose.Schema(
  {
    profileImage: {
      name: String,
      img: {
        data: Buffer, // Binary image data
        contentType: String, // Image type (jpeg/png)
      },
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    account_type: {
      type: String,
      enum: ["admin", "personal", "business"],
      default: "personal",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    number_of_uploads: {
      type: Number,
      default: 0,
    },
    post_limit : {
      type : Number,
      default : 5,
    },
    subscription_type : {
      type : String,
      enum : ['standard', 'premium', 'enterprise'],
      default : 'standard'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userData);
