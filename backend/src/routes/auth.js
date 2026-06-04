const express = require("express");

const router = express.Router()

router.get("/signin", (req,res)=>{
    
})
router.get("/login", (req,res)=>{
    res.send("This is the login page..");
})

router.get("/logout", (req,res)=>{
    res.send("This is the logout page..");
});

module.exports = router;