const express = require("express");
const { signin, login, logout } = require("../controllers/authcontroller");

const router = express.Router()

router.post("/signin", signin)
router.post("/login", login)

router.post("/logout", logout);

module.exports = router;