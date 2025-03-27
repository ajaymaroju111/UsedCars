const mongoose = require("mongoose");
const { Buffer } = require("buffer");
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema(
  {
    profileImage: {
      name: String,
      img: {
        data: Buffer, // Binary image data
        contentType: String, // Image type (jpeg/png)
      },
    },
    username: {
      type: String,
      // required: [true , "please enter the username"],
      trim: true,
      maxlength: 50,
      unique : true,
    },
    email: {
      type: String,
      required: [true , "please enter email"],
      unique: [true , "Email already exist"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true , "please Enter the password"],
      minlength: [8 , "password must be above 8 characters"],
      select : true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
      required: [true , "Please Enter your address"],
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
    },
    expiryTime : {
      type : Date
    }
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = function (enteredPassword) {
  return  bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});


module.exports = mongoose.model("users", UserSchema);
