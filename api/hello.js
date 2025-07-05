// api/hello.js
import Fastify from 'fastify';

const app = Fastify();

app.get('/', async (req, reply) => {
  return { msg: 'Hello from Fastify on Vercel!' };
});

// Vercel Serverless Handler
export default async function handler(req, res) {
  // Ensure Fastify is ready
  await app.ready();
  // Let Fastify handle this req/res
  app.server.emit('request', req, res);
}