

// api/hello.js
import Fastify from 'fastify';

const app = Fastify({ logger: true });

// define your route on `/`
app.get('/', async (req, reply) => {
  return { msg: 'Hello from Fastify on Vercel!' };
});

export default async function handler(req, res) {
  // wait for fastify to be ready
  await app.ready();

  // strip the Vercel prefix (/api/hello)
  const prefix = '/api/hello';
  if (req.url.startsWith(prefix)) {
    // remove prefix, but leave at least '/'
    req.url = req.url.slice(prefix.length) || '/';
  }

  // hand off to Fastify’s internal server
  app.server.emit('request', req, res);
}