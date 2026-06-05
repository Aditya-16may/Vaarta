const express = require("express");
const app = express();
require("dotenv").config();
const auth = require("./routes/auth")
const messages = require("./routes/messages")
const path = require("path");
const PORT = process.env.PORT||3000;
const __dirname = path.resolve();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/auth", auth);
app.use("/api/messages", messages);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (_,res)=>{
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
    })
}

app.listen(PORT, ()=>{
    console.log(`Server is running on port : ${PORT}`);
});