const userModel = require("../models/User");
const generateToken = require("./generateToken");
const { sendWelcomeEmail } = require("../emails/emailHandlers");
const bcrypt = require("bcrypt");
const v2 = require("../lib/cloudinary")

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

                    try{
                        await sendWelcomeEmail(email, name, process.env.CLIENT_URL);
                    } catch(error){
                        console.error("failed to send welcom email, error : ", error);
                    }

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

module.exports.login = async (req,res)=>{
    let {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:"All fields are required!!"});
    }
    try{
        const user = await userModel.findOne({email});
        if(!user) return res.status(400).json({message: "Invalid credentials"})
        let can_login = await bcrypt.compare(password, user.password);
        if(can_login){
            let token = generateToken(user);
            res.cookie("token", token,{
                maxAge: 7*24*60*60*1000,
                httpOnly : true, //prevent XSS attacks: cross-site scripting
                sameSite : "strict", // CSRF attacks
                secure : process.env.NODE_ENV === "development" ? false : true,
                    
            });
            return res.status(201).json({
                        message: "User logged in",
                        _id: user._id,
                        email : user.email,
                        name : user.name,
                        profilePic : user.profilePic
                    });

        } else {
            res.status(400).json({message: "Invalid credentials"});
        }
    } catch(error){
        console.error("Error occured : ", error)
    }
     
}

module.exports.logout = (req,res)=>{
    res.cookie("token", "",{
        maxAge: 0,
        httpOnly:true,
        sameSite:"strict",
        secure: process.env.NODE_ENV !== "development"
    });
    res.status(200).json({message:"User logged out"});
}

module.exports.updateProfile = async (req,res)=>{
    try{
        let { profilePic } = req.body;
        if(!profilePic){
            return res.status(400).json({message:"Profile pic is required"});
        }
        let user = await userModel.findOne({email : req.user.email});
        if(!user){
            console.log("user not found during profile pic updation..!");
            return res.status(400).json({message:"User not found"});
        }
        const upload = await v2.uploader.upload(profilePic);
        user.profilePic = upload.secure_url;

        await user.save();
        res.status(200).json({
            profilePic: user.profilePic
        });

    } catch(error){
        console.error("An error occured while updation of profile : ", error);
        return res.status(400).json({message: "Something went wrong while updation of profile pic"});
    }
}