import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

    senderId : {
    type : mongoose.Schema.Types.ObjectId,
    required : true    
    },

    receiverId : {
    type : mongoose.Schema.Types.ObjectId,
    required : true    
    },

    text : {
        type : String,
    },
    image : {
        type : String,
    },
    video : {
        type : String,
    }

}, {timestamps : true})

const Usermessage =  mongoose.model("Usermessage", messageSchema)

export default Usermessage;