// api/[[...all]].js
import Fastify from "fastify"
import FastifyJwt from "@fastify/jwt"
import bcrypt from "bcrypt"

import { config as loadEnv } from "dotenv"
console.log("Loading environment variables...")

// Load .env locally
if (!process.env.VERCEL) loadEnv()



console.log("Connecting to:", process.env.MONGODB_URI)

import mongoose from "mongoose"
import User from "../models/User.js"
import nodemailer from "nodemailer"



let isConnected = false

export async function connectDB() {
  if (isConnected) return

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: "genelec",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  isConnected = true
  console.log("[Mongoose] Connected ✅")
}



// --- Fastify setup ---
const app = Fastify({ logger: true })
app.register(FastifyJwt, {
  secret: process.env.JWT_SECRET,
  // Custom function to extract token from header (optional):
  decode: (req) => {
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith("Bearer ")) return null
    return auth.slice(7)
  }
})

app.decorate("authenticate", async (req, reply) => {
  try {
    await req.jwtVerify()

    const tokenFp = req.user.fingerprint
    const headerFp = req.headers["x-device-fingerprint"]

    console.log("Decoded token:", req.user)
    console.log("Device fingerprint from header:", headerFp)

    if (!tokenFp || !headerFp || tokenFp !== headerFp) {
      console.warn("⚠️ Fingerprint mismatch")
      return reply.code(403).send({ error: "Access denied: device mismatch" })
    }
  } catch (err) {
    console.error("❌ Auth error:", err)
    return reply.code(401).send({ error: "Invalid or missing token" })
  }
})

// --- Routes ---

app.post("/api/login", async (req, reply) => {
  console.log("🔐 Login route triggered")

  await connectDB()

  const { email, password, fingerprint } = req.body || {}

  if (!email || !password || !fingerprint) {
    return reply.code(400).send({ error: "Email, password, and fingerprint required" })
  }

  const user = await User.findOne({ email })
  if (!user) {
    return reply.code(401).send({ error: "Invalid email or password" })
  }

  const isMatch = await bcrypt.compare(password, user.hash)
  if (!isMatch) {
    return reply.code(401).send({ error: "Invalid email or password" })
  }

  // Optional: Store the fingerprint for future comparisons or trusted devices
  user.fingerprint = fingerprint
  await user.save()

  const token = app.jwt.sign({
    email: user.email,
    fingerprint: fingerprint // 🔐 embed in token
  })

  reply.send({ msg: "Login successful", token })
})

// Signup route
app.post("/api/signup", async (req, reply) => {

  console.log("✅ Signup route triggered")

  await connectDB()

  const { fullName, userName, email, password } = req.body || {}

  if (!fullName || !userName || !email || !password) {
    return reply.code(400).send({ error: "All fields are required" })
  }

  const exists = await User.findOne({ $or: [{ email }, { userName }] })
  if (exists) return reply.code(409).send({ error: "Email or username already exists" })

  const hash = await bcrypt.hash(password, 10)
  const user = await User.create({ fullName, userName, email, hash })
  const token = app.jwt.sign({ email: user.email })

  reply.send({ msg: "Account created", token })
})



app.post("/api/change-password", async (req, reply) => {
  console.log("🔐 /api/change-password route hit")

  const { oldPassword, newPassword, fingerprint, email, resetCode } = req.body || {}

  if (!newPassword) {
    return reply.code(400).send({ error: "New password is required" })
  }

  await connectDB()

  // 📦 Reset Flow: coming from password reset page
  if (email && resetCode) {
    const user = await User.findOne({ email })
    if (!user) return reply.code(404).send({ error: "User not found" })

    if (user.resetCode !== resetCode) {
      return reply.code(401).send({ error: "Invalid reset code" })
    }

    if (Date.now() > user.resetExpires) {
      return reply.code(410).send({ error: "Reset code expired" })
    }

    user.hash = await bcrypt.hash(newPassword, 10)
    user.resetCode = undefined
    user.resetExpires = undefined
    await user.save()

    return reply.send({ msg: "Password updated via reset link" })
  }

  // 🔐 Authenticated Flow (original logic with JWT + oldPassword)
  try {
    await req.jwtVerify()

    const user = await User.findOne({ email: req.user.email })
    if (!user) return reply.code(404).send({ error: "User not found" })

    if (user.fingerprint !== fingerprint) {
      return reply.code(403).send({ error: "Fingerprint mismatch" })
    }

    const match = await bcrypt.compare(oldPassword, user.hash)
    if (!match) return reply.code(401).send({ error: "Incorrect current password" })

    user.hash = await bcrypt.hash(newPassword, 10)
    await user.save()

    reply.send({ msg: "Password updated successfully" })
  } catch (err) {
    console.error("❌ Auth error:", err)
    reply.code(401).send({ error: "Unauthorized or invalid token" })
  }
})

app.get("/api/check-username", async (req, reply) => {
  await connectDB()
  const { userName } = req.query
  if (!userName) return reply.code(400).send({ error: "Missing username" })

  const exists = await User.exists({ userName })
  reply.send({ available: !exists })
})

app.get("/api/profile", { preValidation: app.authenticate }, async (req, reply) => {
  console.log("📍 /api/profile route hit")

  if (!req.user || !req.user.email) {
    console.warn("⚠️ Missing user or email after jwtVerify:", req.user)
    return reply.code(401).send({ error: "Unauthorized access" })
  }

  await connectDB()

  try {
    const user = await User.findOne({ email: req.user.email }, "-hash")
    if (!user) {
      return reply.code(404).send({ error: "User not found" })
    }

    reply.send({ user })
  } catch (err) {
    console.error("❌ DB error:", err)
    reply.code(500).send({ error: "Server error while retrieving profile" })
  }
})

if (!process.env.VERCEL) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}


const transporter = nodemailer.createTransport({
  service: "gmail", // or SMTP config
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

app.post("/api/request-password-reset", async (req, reply) => {
  const { email } = req.body || {}
  const lang = req.headers["x-lang"] || "en"  // detect user language

  if (!email) {
    return reply.code(400).send({ error: "Email required" })
  }

  try {
    await connectDB()
    const user = await User.findOne({ email })

    // Security: Don't reveal if an email is registered.
    // We proceed as if sending, but only do it if the user exists.
    if (user) {
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = Date.now() + 15 * 60 * 1000 // 15 minutes

      user.resetCode = resetCode
      user.resetExpires = expiresAt
      await user.save()

      const protocol = process.env.VERCEL_URL ? 'https' : 'http'
      const host = process.env.VERCEL_URL || req.headers.host
      const baseUrl = `${protocol}://${host}`
      const url = `${baseUrl}/reset/?code=${encodeURIComponent(resetCode)}&email=${encodeURIComponent(email)}`

      const subject = lang === "id" ? "Atur Ulang Kata Sandi Anda" : "Reset Your Password"
      const html = lang === "id"
        ? `<p>Berikut adalah kode atur ulang kata sandi Anda: <b>${resetCode}</b></p><p>Atau klik <a href="${url}">tautan ini</a> untuk membuka formulir atur ulang.</p>`
        : `<p>Here is your password reset code: <b>${resetCode}</b></p><p>Or click <a href="${url}">this link</a> to open the reset form.</p>`

      // This is a slow operation, the user must wait for it to complete.
      await transporter.sendMail({
        to: email, subject, html, from: `No-Reply <${process.env.EMAIL_USER}>`,
      })
      console.log(`Password reset email sent to ${email}`)
    }

    // Send success response after all operations are done.
    reply.send({ msg: "If your email is registered, you will receive reset instructions." })
  } catch (err) {
    console.error("Error sending reset email:", err)
    // Send a generic error to the client, but log the real error on the server.
    reply.status(500).send({ error: "Failed to send reset instructions. Please try again later." })
  }
})

app.post("/api/verify-reset-code", async (req, reply) => {
  const { email, code } = req.body || {}
  if (!email || !code) return reply.code(400).send({ error: "Email and code required" })

  await connectDB()
  const user = await User.findOne({ email })
  if (!user || user.resetCode !== code) {
    return reply.code(401).send({ error: "Invalid code" })
  }

  if (Date.now() > user.resetExpires) {
    return reply.code(410).send({ error: "Code expired" })
  }

  reply.send({ msg: "Code verified" })
})



// (Add more routes here: login, protected data, etc.)
export default async function handler(req, res) {
  console.log("🔍 Fastify sees URL:", req.url)
  await app.ready()

  app.server.emit("request", req, res)
}
