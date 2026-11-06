import { getAuth } from "@clerk/express";
import User from "../models/User.js";

export async function protectRoute(req, res, next) {
   try {
        const {UserId} = getAuth(req);

        if(!UserId) {
            res.status(401).json ({message : "Unauthorized"});
            return;
        }

        const user = await User.findOne({clerkId : UserId});

        if(!user){
            res.status(404).json({message : "User profile is nopt synced yet"});
        }
  
        req.user = user;
        next();
   } catch(error) {
        console.log("Error is in protectRoute", error.message);
        res.status(500).json({message : "Internal server error"});
    }
}

