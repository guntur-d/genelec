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
    await req.jwtVerify() // 👈 MUST call this or req.user stays null
    // Optionally: log decoded payload
    console.log("Decoded:", req.user)
  } catch (err) {
    reply.code(401).send({ error: "Invalid or missing token" })
  }
})

// --- Routes ---

app.post("/api/login", async (req, reply) => {
  console.log("🔐 Login route triggered")

  await connectDB()

  const { email, password } = req.body || {}

  if (!email || !password) {
    return reply.code(400).send({ error: "Email and password required" })
  }

  const user = await User.findOne({ email })
  if (!user) {
    return reply.code(401).send({ error: "Invalid email or password" })
  }

  const isMatch = await bcrypt.compare(password, user.hash)
  if (!isMatch) {
    return reply.code(401).send({ error: "Invalid email or password" })
  }

  const token = app.jwt.sign({ email: user.email })
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




// (Add more routes here: login, protected data, etc.)
export default async function handler(req, res) {
  console.log("🔍 Fastify sees URL:", req.url)
  await app.ready()
 
  app.server.emit("request", req, res)
}
