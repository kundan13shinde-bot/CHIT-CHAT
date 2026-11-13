import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";
import { ConnectDB } from "../lib/db.js";

const testUsers = [
  {
    clerkId: "seed_user_aarav_sharma",
    email: "aarav.sharma@example.com",
    fullname: "Aarav Sharma",
    profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    clerkId: "seed_user_priya_patel",
    email: "priya.patel@example.com",
    fullname: "Priya Patel",
    profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
  {
    clerkId: "seed_user_rohan_verma",
    email: "rohan.verma@example.com",
    fullname: "Rohan Verma",
    profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
  {
    clerkId: "seed_user_ananya_iyer",
    email: "ananya.iyer@example.com",
    fullname: "Ananya Iyer",
    profilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    clerkId: "seed_user_vikram_singh",
    email: "vikram.singh@example.com",
    fullname: "Vikram Singh",
    profilePic: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
  },
  {
    clerkId: "seed_user_sneha_reddy",
    email: "sneha.reddy@example.com",
    fullname: "Sneha Reddy",
    profilePic: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  },
  {
    clerkId: "seed_user_aditya_kumar",
    email: "aditya.kumar@example.com",
    fullname: "Aditya Kumar",
    profilePic: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
  },
  {
    clerkId: "seed_user_neha_gupta",
    email: "neha.gupta@example.com",
    fullname: "Neha Gupta",
    profilePic: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
  },
];

export async function seedUsers() {
  try {
    await ConnectDB();

    console.log("Seeding test users into database...");

    for (const userData of testUsers) {
      await User.findOneAndUpdate(
        { email: userData.email },
        { $set: userData },
        { upsert: true, returnDocument: "after", runValidators: true }
      );
      console.log(`✓ Seeded user: ${userData.fullname} (${userData.email})`);
    }

    console.log(`\nAll ${testUsers.length} test users successfully seeded!`);
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  }
}

seedUsers();

