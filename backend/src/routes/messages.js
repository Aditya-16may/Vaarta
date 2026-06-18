const express = require("express");
const { arcjetProtection } = require("../middlewares/arckjet_middleware");
const { IsLoggedIn } = require("../middlewares/IsLoggedIn");
const {getAllcontacts, getMessagesByUserId, sendMessages, getChatPartners,deleteMessage} = require("../controllers/messageControllers");

const router = express.Router()

router.use(arcjetProtection, IsLoggedIn);

router.get("/contacts", getAllcontacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessages)
router.delete("/delete/:messageId", deleteMessage);

module.exports = router;
