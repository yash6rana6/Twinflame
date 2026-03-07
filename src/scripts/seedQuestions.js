import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Question from "../models/Question.js";

/* 🔥 THIS IS IMPORTANT */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error("❌ MONGODB_URL not found in env");
}



const questions = [
  { text: "Mera sabse bada fear kya hai?" },
  { text: "Main jab upset hota/hoti hoon toh kya chahta/chahti hoon?" },
  { text: "Meri sabse favourite habit kya hai?" },
  { text: "Main kis baat pe sabse zyada jealous feel karta/karti hoon?" },
  { text: "Mujhe kaunsa food bina bole khila sakte ho?" },
  { text: "Meri sabse badi weakness kya hai?" },
  { text: "Main kaunsa song repeat pe sunta/sunti hoon?" },
  { text: "Mujhe kaunsa moment humara sabse special lagta hai?" },
  { text: "Mujhe kis type ka surprise sabse zyada pasand aayega?" },
  { text: "Main gusse me sabse pehle kya bol deta/deti hoon?" },

  { text: "Mujhe kaunsa nickname secretly pasand hai?" },
  { text: "Main future me sabse pehle kya achieve karna chahta/chahti hoon?" },
  { text: "Mujhe kaunsa place sabse zyada sukoon deta hai?" },
  { text: "Main kab emotionally weak feel karta/karti hoon?" },
  { text: "Meri sabse badi insecurity kya hai?" },
  { text: "Mujhe kis cheez pe sabse zyada proud feel hota hai?" },
  { text: "Main kaunsa topic avoid karta/karti hoon?" },
  { text: "Mujhe kaunsa kind of love sabse zyada chahiye?" },
  { text: "Main secretly kis baat se darta/darti hoon?" },
  { text: "Mere liye ‘perfect relationship’ ka matlab kya hai?" },
];

async function seedQuestions() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URL);

    console.log("🧹 Clearing old system questions...");
    await Question.deleteMany({ source: "system" });

    console.log("🌱 Inserting questions...");
    const docs = questions.map((q, index) => ({
      ...q,
      source: "system",
      order: index + 1,
      isPremium: false,
    }));

    await Question.insertMany(docs);

    console.log("✅ 20 Questions seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedQuestions();
