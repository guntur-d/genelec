import Fastify from 'fastify'
import pointOfView from '@fastify/view'
import pug from 'pug'
import path from 'path'

const app = Fastify({ logger: true })

app.register(pointOfView, {
  engine: { pug },
  root:  path.join(process.cwd(), 'views'),
  viewExt: 'pug',
})

app.get('/', (req, reply) =>
  reply.view('index', {
    title:   'Home',
    message: 'Welcome to `/`!',
  })
)

app.get('/hello', async (_, reply) =>
  reply.send({ msg: 'Hello from Fastify on Vercel!' })
)

app.post('/echo', async (req, reply) => {
  // pull off the Vercel catch-all key, keep the rest
  const { ['[...all]']: _, ...cleanQuery } = req.query;

  return {
    youSent: req.body,
    query:   cleanQuery
  };
});

// api/[[...all]].js
export default async function handler(req, res) {
  await app.ready();

  // 1) Split off the querystring
  const [rawPath, rawQS] = req.url.split('?');
  const qs = rawQS ? '?' + rawQS : '';

  // 2) Strip "/api" prefix (for both "/api" and "/api/echo")
  let newPath = rawPath.startsWith('/api')
    ? rawPath.slice(4)
    : rawPath;

  // 3) Ensure at least "/"
  if (newPath === '') newPath = '/';

  // 4) Rewrite req.url for Fastify
  req.url = newPath + qs;

  // 5) Hand off to Fastify
  app.server.emit('request', req, res);
}
