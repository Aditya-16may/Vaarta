const express = require("express");
const app = express();
require("dotenv").config();

const auth = require("./routes/auth");
const messages = require("./routes/messages");
const path = require("path");
const connectDB = require("./lib/db");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", auth);
app.use("/api/messages", messages);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../../frontend", "dist")));

    app.use((req, res) => {
        res.sendFile(path.join(__dirname, "../../frontend", "dist", "index.html"));
    });
}

const PORT = process.env.PORT || 3000;
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
};

startServer();