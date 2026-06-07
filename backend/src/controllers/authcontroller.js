const jwt = require("jsonwebtoken");
const userModel = require("../models/User");
const generateToken = require("./generatetoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

module.exports.signin = async (req,res)=>{
    let { name, email, password} = req.body;
    try{
        if(!name || !email || !password){
            return res.status(400).json({message: "All fields are required !!"});
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password should contain atleast 6 characters"});
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message : "Email should be a valid one."})
        }
        const user = await userModel.findOne({email});
        if(user){
            return res.status(400).json({message : "User already registered"})
        }
        else{
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(password, salt, async (err, hash)=>{
                    let user = await userModel.create({
                        name,
                        password: hash,
                        email 
                    })
        
                    let token = generateToken(user);
                    // console.log("token : ", token);

                    res.cookie("token", token, {
                        maxAge: 7*24*60*60*1000,
                        httpOnly : true, //prevent XSS attacks: cross-site scripting
                        sameSite : "strict", // CSRF attacks
                        secure : process.env.NODE_ENV === "development" ? false : true,
                    });

                    // console.log("cookie is set");
                    return res.status(201).json({
                        _id: user._id,
                        email : user.email,
                        name : user.name,
                        profilePic : user.profilePic
                    });

                })
            })
            
        }
    }
    catch(error){
        console.error("Error in signup controller is :" , error);
        res.status(500).json({message : "Internal server error"});
    }
    
}
