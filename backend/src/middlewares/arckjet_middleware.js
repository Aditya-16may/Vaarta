const { isSpoofedBot } = require("@arcjet/inspect");
const aj = require("../lib/arcjet");

module.exports.arcjetProtection = async (req,res,next)=>{
    try{
        const decision = await aj.protect(req);

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return res.status(429).json({message : "Too many requests"});
            } else if(decision.reason.isBot()){
                return res.status(403).json({message: "Automated traffic is not allowed"});
            } else{
                return res.status(403).json({message : "Access denied by security policy"});
            }
        }

        //check for spoofbots
        if(decision.results.some(isSpoofedBot)){
            return res.status(403).json({
                error : "Spoofed bot detected",
                message : "Malicious bot activity detected."
            });
        }

        next();
    } catch(error){
        console.error("Arcjet Protection Error: ",error);
        return res.status(400).json({message:"Something went wrong"});
    }
}