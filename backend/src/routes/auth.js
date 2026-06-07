const express = require("express");
const { signin } = require("../controllers/authcontroller");

const router = express.Router()

router.post("/signin", signin)
router.get("/login", (req,res)=>{
    res.send("This is the login page..");
})

router.get("/logout", (req,res)=>{
    res.send("This is the logout page..");
});

module.exports = router;