const  v2  = require("../lib/cloudinary");
const MessageModel = require("../models/messagemodel")
const UserModal = require("../models/User");

module.exports.getAllcontacts = async (req,res)=>{
    try{
        const loggedinUser = req.user._id;
        const contacts = await UserModal.find({_id:{$ne: loggedinUser}}).select("-password");

        res.status(200).json({message: contacts});
    }  catch(error){
        console.error("Error occured while filtering the contacts : ", error);
        res.status(500).json({message: "Server  error "});
    }
}
module.exports.getMessagesByUserId = async (req,res)=>{
    try{
        const sender_id = req.user._id;
        const receiver_id = req.params.id;
        const messages = await MessageModel.find({
            $or: [
                {senderId:sender_id, receiverId: receiver_id},
                {senderId:receiver_id, receriverId :sender_id}
            ]
        })
        res.status(200).json({message:messages});
    }
    catch(error){
        console.error("An error occured in messages : ", error);
        res.status(500).json({message:"Internal server Error"});
    }
}
module.exports.sendMessages = async (req,res)=>{
    try{
        let { text, image} = req.body;
        const sender_id = req.user._id;
        const receiver_id = req.params.id;
        let image_url;
        if(image){
            const upload = await v2.uploader.upload(image);
            image_url = upload.secure_url;
        }

        const message = await MessageModel.create({
            senderId : sender_id,
            receiverId : receiver_id,
            text,
            image : image_url
        })

        // scoket io implementation later on for real time data display

        res.status(200).json({message});

    }catch(error){
        console.error("An error occured in sending messages : ", error);
        res.status(500).json({message:"Internal server Error"});
    }
}
module.exports.getChatPartners = async (req,res)=>{
    try{
        const user_id = req.user._id;
        const messages = await MessageModel.find({
            $or:[{senderId: user_id}, {receiverId: user_id}]
        });

        const chatPartnersId =[
            ...new Set(
                messages.map((msg)=>
                msg.senderId.toString() === user_id.toString()
                ? msg.receiverId.toString()
                : msg.senderId.toString()
                )
            )
        ]

        const chatPartners = await UserModal.find({_id : {$in:chatPartnersId}}).select("-password");
        res.status(200).json({chatPartners});

    } catch(error){
        console.error("An error occured in finding chat partners : ", error);
        res.status(500).json({message:"Internal server Error"});
    }
    
}   