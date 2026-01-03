import Fastify from "fastify";
import { createToken } from "./auth.js";

const fastify = Fastify({
  logger: true
});

fastify.post('/api/token', {
  schema: {
    body: {
      type: 'object',
      required: ['email'],
      properties: {
        email: { type: 'string' }
      }
    }
  }
}, async (request, reply) => {
  const { email } = request.body as { email: string };
  const token = createToken(email);
  return reply.send({ token });
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
