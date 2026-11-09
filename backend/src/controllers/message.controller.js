import User from "../models/User.js";
import Usermessage from "../models/messageschema.js"
import { hasImageKitConfig, uploadChatmedia } from "../lib/imagekit.js";

export async function getUsersForSidebar(req, res) {
    try {
        const loggedInUserId = req.user._id;

        const filterUsers = await User.find({_id : {$ne : loggedInUserId}}).select("-clerkId")

        res.status(200).json(filterUsers);

    } catch(error) {
        console.log("Error in getUsersForSidebar:", error.message);
        res.status(500).json({ message : "Internal server error"});
    }
}

export async function getConversationForSidebar(req, res) {
    try {
        const loggedInUserId = req.user._id;
        const converstations = await Usermessage.aggregate([
            { $match : { $or: [{senderId : loggedInUserId}, {receiverId : loggedInUserId}]}},
            {
            $group: {
                _id : {$cond : [{$eq : ["$senderId", loggedInUserId]}, "$receiverId", "$senderId"]},
                lastMessageAt : {$max : "$createdAt"},
             },
            },
            {$sort : {lastMessageAt: -1}},

            {$lookup : {from : "users", localField : "_id", foreignField: "_id", as :"user"}},
            {$replaceRoot: { newRoot : {$first :"$user"}}},

            {$project: {clerkId : 0}},
         ]);
         
         res.status(200).json(converstations);
    } catch(error) {
        console.log("Error in getConversationForSidebar:", error.message);
        res.status(500).json({ message : "Internal server error"});
    }
}


export async function getMessages(req, res){
    try {
      const { id : userToChatId} = req.params;
      const myId = req.user._id;
      
      const messages = await Usermessage.find({
        $or : [
            {senderId : myId, receiverId : userToChatId},
            {senderId : userToChatId, receiverId : myId}
        ]
      }).sort({createdAt : 1});
      res.status(200).json(messages);
    } catch(error){
      console.log("Error in getMessages:", error.message);
      res.status(500).json({ message : "Internal server error"});
    }
}

export async function sendMessage(req, res) {
    try {
  const {text} = req.body;
  const {id : receiverId} = req.params;
  const senderId = req.user._id;
     
  let imageUrl;
  let videoUrl;

  if(req.file) {
    if(!hasImageKitConfig()){
        return res.status(500).json({message : "ImageKit is not configured"}); 
    }
      const url =  await uploadChatmedia(req.file);
        if(req.file.mimetype.startsWith("video/")) videoUrl = url;
        else imageUrl = url;

    } 
    const newMessage = new Usermessage({
        senderId,
        receiverId,
        text,
        image : imageUrl,
        video : videoUrl
    });

    await newMessage.save();
    res.status(201).json(newMessage);

    const receiverSocketId = getReceiverSocketId(receiverId);
    // only send message to receiver if they are online and have a socket connection  
    if(receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
    }

} catch (error) {
        console.log("Error in sendMessage:", error.message);
        res.status(500).json({ message : "Internal server error"});
    }
}
            