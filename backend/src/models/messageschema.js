import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

    sender : {
    type : mongoose.Schema.Types.ObjectId,
    required : true    
    },

    receiver : {
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

const Usermeassage =  mongoose.model("Usermeassage", messageSchema)

export default Usermeassage;