const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const userModal = require("../models/User")

module.exports.IsLoggedIn = async (req,res,next)=>{
    if(!req.cookies.token){
        return res.status(400).json({message : "You need to be logged in first.."})
    }
    else{
        try{
            let decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
            let user = await userModal.findOne({email : decoded.email});
            req.user = user;
            next();
        }
        catch(error){
            return res.status(400).json({message : "An error occured .. Please try again..!"});
        }
    }
}