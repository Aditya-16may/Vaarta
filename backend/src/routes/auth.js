const express = require("express");
const { signin, login, logout, updateProfile } = require("../controllers/authcontroller");
const { IsLoggedIn } = require("../middlewares/IsLoggedIn");
const { arcjetProtection } = require("../middlewares/arckjet_middleware");

const router = express.Router()
router.use(arcjetProtection);

router.post("/signin", signin)
router.post("/login",login)
router.post("/logout", logout);

router.put("/update-profile", IsLoggedIn , updateProfile);
router.get("/check",IsLoggedIn, (req,res)=>{
    res.status(200).json(req.user);
});

module.exports = router;