import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    // Address: String,
    // phonenumber: String,
    // drivinglicencenumber: Number,
    // paymentmethodes: String

})

export const User = mongoose.model('User',userSchema)