// api/server.js
const fastify = require('fastify')({
  logger: true
})
const serverless = require('serverless-http')

// 1) Define a simple “hello” route
fastify.get('/api/hello', async (request, reply) => {
  return { msg: 'Hello from Fastify on Vercel!' }
})

// 2) Another sample route with query or body
fastify.post('/api/echo', async (request, reply) => {
  return {
    youSent: request.body,
    query: request.query
  }
})

// 3) Export handler wrapped by serverless-http
module.exports = serverless(fastify)