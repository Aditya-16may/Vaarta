const jwt = require("jsonwebtoken");
const userModel = require("../models/User");

module.exports.socketAuthMiddleware = (socket, next) => {
    try{
        const token = socket.handshake.headers.cookie
            ?.split("; ")
            .find((cookie) => cookie.startsWith("jwt="))
            ?.split("=")[1];

        if (!token) {
            return next(new Error("Authentication error"));
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return next(new Error("Authentication error"));
            }

            const user = await userModel.findById(decoded.id);
            if (!user) {
                return next(new Error("User not found"));
            }

            socket.user = user;
            socket.userId = user._id.toString();
            next();
        });
    } catch(error){
        console.error("Socket authentication error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    
};