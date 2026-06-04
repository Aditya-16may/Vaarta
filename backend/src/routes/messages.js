const express = require("express");

const router = express.Router()

router.get("/send", (req,res)=>{
    res.send("this is the sending page")
})

router.get("/receive", (req,res)=>{
    res.send("receieved messages will be handled here");
});

module.exports = router;