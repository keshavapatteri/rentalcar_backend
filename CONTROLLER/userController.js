import bcrypt from "bcrypt"

import { User } from "../MODEL/userModel.js";
import { generateUserToken } from "../UTILITIS/generateToken.js";
import { cloudinaryInstance } from "../Config/cloudinaryConfig.js";
// For User Creating...

// User Create Function

export const UserCreate = async (req, res, next) => {
    try {

        const { name, email, password,address,phonenumber,drivinglicencenumber } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: `all fields required` });
        }
       
        const salt = 10;
        const hashedPassword = bcrypt.hashSync(password, salt);

        //for storing to DB-make a instance
 // Upload the image to Cloudinary
 if (!req.file) {
    return res.status(400).json({ success: false, message: "Please upload an image" });
  }
  const uploadResult = await cloudinaryInstance.uploader.upload(req.file.path, { folder: "car" });

        const newUser = new User({ name, email, password: hashedPassword,address,phonenumber,drivinglicencenumber,image: uploadResult?.url  })
   
        await newUser.save() // saving to db


    
        const token = generateUserToken(email);

        res.cookie('token', token);
    
        res.json({ success: true, message: "user created suceessfully" })


    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'internal error' });

    }
}


// For user loginexport 
export const UserLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check if user exists
        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(400).json({ success: false, message: "User does not exist" });
        }

        console.log("Plain Password:", password); // Check if password is defined
        console.log("Hashed Password from DB:", userExist.password); // Check if hashed password is defined

        // Compare password
        const passwordMatch = bcrypt.compareSync(password, userExist.password);
        if (!passwordMatch) {
            return res.status(400).json({ success: false, message: "Incorrect password" });
        }

        const token = generateUserToken(email);
        res.cookie('token', token);
        res.json({ success: true, message: "User logged in successfully", status: 200, token: token });

    } catch (error) {
        console.error("Error:", error); // Log the error for debugging
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
}



//===================>                        
//user logout
export const UserLogout = async (req, res, next) => {

    res.clearCookie("token")
    res.json({ success: true, message: 'User logged out successfully' })


}


//user profile
export const UserProfile = async (req, res, next) => {
    try {

        const user=req.user
        const userData=await User.findOne({email:user.email}).select("-password")

        
      res.json({success:true,message:'user data fetched',data:userData})

    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server" });


    }
}

// Check user authentication
export const cheackUser = async (req, res, next) => {
    try {
        const user = req.user;

        // If user is not authenticated, return an error
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not authenticated' });
        }

        // If user is authenticated, send success response
        return res.json({ success: true, message: "User authenticated" });
    } catch (error) {
        // Handle any unexpected errors
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
};


//====>update booking