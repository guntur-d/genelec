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
    dbName: "your-db-name",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  isConnected = true
  console.log("[Mongoose] Connected ✅")
}



// --- Fastify setup ---
const app = Fastify({ logger: true })
app.register(FastifyJwt, { secret: process.env.JWT_SECRET })

// --- Routes ---
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


// (Add more routes here: login, protected data, etc.)
export default async function handler(req, res) {
  console.log("Raw incoming URL:", req.url)
  await app.ready()

  // Remove query param hack added by Vercel
  // const url = req.url.split("?")[0]

  // req.url = url // Clean route like "/signup"
  app.server.emit("request", req, res)
}
