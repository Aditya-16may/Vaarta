const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
// console.log("Node DNS:", dns.getServers());
const mongoose = require("mongoose");

const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        // console.log("MONGODB connected : ", conn.connection.host);
    }
    catch(error){
        console.error("MONGODB connection failed :", error);
        process.exit(1); // status code 1 means failure , 0 means success 
    }
}
module.exports = connectDB;