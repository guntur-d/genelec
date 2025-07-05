const fastify = require('fastify')();

fastify.get('/api/hello', async (request, reply) => {
    return { message: 'Hello from Fastify on Vercel!' };
});

// Export the handler for Vercel
module.exports = (req, res) => {
    fastify.ready(err => {
        if (err) throw err;
        fastify.server.emit('request', req, res);
    });
};