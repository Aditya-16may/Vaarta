const express = require("express");
require("dotenv").config();

const auth = require("./routes/auth");
const messages = require("./routes/messages");
const path = require("path");
const connectDB = require("./lib/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { IsLoggedIn } = require("./middlewares/IsLoggedIn");
const { server, io, app } = require("./lib/socket");

app.use(
  cors({
    origin:process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb", extended: true }));

app.use("/api/auth", auth);
app.use("/api/messages", messages);
app.get("/check", IsLoggedIn)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../../frontend", "dist")));

    app.use((req, res) => {
        res.sendFile(path.join(__dirname, "../../frontend", "dist", "index.html"));
    });
}

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB();

    server.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
};

startServer();
