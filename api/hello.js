// api/hello.js
const fastify = require('fastify')({ logger: true });
const serverless = require('serverless-http');

fastify.get('/', async (req, reply) => {
  return { msg: 'Hello from Fastify on Vercel!' };
});

module.exports = serverless(fastify);