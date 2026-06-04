const express = require("express");
const app = express();
require("dotenv").config();
const auth = require("./routes/auth")
const messages = require("./routes/messages")

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/auth", auth);
app.use("/api/messages", messages);

app.listen(process.env.My_port||3000);