import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
 
    name: String,
    email: String,
    password: String,
    address: String,
    phonenumber: String,
     drivinglicencenumber: Number,
    // paymentmethodes: String
    image: {
      type: String,
   required:true,

  },
    createdAt: {
        type: Date,
        default: Date.now,
      },
})

export const User = mongoose.model('User',userSchema)