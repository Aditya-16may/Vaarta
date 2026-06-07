const jwt = require("jsonwebtoken");

const generateToken = (user)=>{
    let token = jwt.sign({email : user.email, id : user._id},process.env.JWT_SECRET, {
        expiresIn:"7d",
    });
    
    return token;
}

module.exports = generateToken;  