import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDb } from "@/lib/db";
import User from "@/models/User";

function verifyTelegramInitData(initData, botToken) {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const computedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  if (computedHash !== hash) return null;

  const userJson = params.get("user");
  if (!userJson) return null;
  return JSON.parse(userJson);
}

const authOptions = {
  providers: [
    Credentials({
      id: "credentials",
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDb();

        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

        const ok = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!ok) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),

    Credentials({
      id: "telegram",
      credentials: { initData: { type: "text" } },
      async authorize(credentials) {
        if (!credentials?.initData) return null;

        const tgUser = verifyTelegramInitData(
          credentials.initData,
          process.env.TELEGRAM_BOT_TOKEN
        );
        if (!tgUser?.id) return null; // bad/forged data → reject

        await connectDb();

        let user = await User.findOne({ telegramId: tgUser.id.toString() });

        if (!user) {
          // Synthetic email/password — Telegram users never use these,
          // they only exist because the schema currently requires them.
          const randomPassword = await bcrypt.hash(
            crypto.randomBytes(24).toString("hex"),
            10
          );
          user = await User.create({
            telegramId: tgUser.id.toString(),
            name: `${tgUser.first_name || ""} ${tgUser.last_name || ""}`.trim() || tgUser.username || "Telegram User",
            email: `tg_${tgUser.id}@telegram.local`,
            password: randomPassword,
            isVerified: true, // Telegram already verified this identity
          });
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
export { authOptions };