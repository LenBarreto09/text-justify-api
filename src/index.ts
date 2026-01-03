import Fastify from "fastify";
import { createToken, verifyToken, incrementWordCount } from "./auth/auth.js";
import { justify } from "./justify/justify.js";

const fastify = Fastify({
  logger: true
});

fastify.addContentTypeParser('text/plain', { parseAs: 'string' }, function (req, body, done) {
  done(null, body);
});

const extractToken = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};

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

fastify.post('/api/justify', {
  schema: {
    headers: {
      type: 'object',
      required: ['authorization'],
      properties: {
        authorization: { type: 'string' }
      }
    }
  },
  preHandler: (request, reply) => {
    if (request.headers['content-type'] !== 'text/plain') {
      return reply.code(400).send({ error: 'Content-Type must be text/plain' });
    }
  }
}, async (request, reply) => {
  try {
    const authHeader = request.headers.authorization as string;
    const token = extractToken(authHeader);
    
    if (!token) {
      return reply.code(401).send({ error: 'Missing or invalid Authorization header' });
    }

    const tokenData = verifyToken(token);
    if (!tokenData) {
      return reply.code(401).send({ error: 'Invalid token' });
    }

    const text = request.body as string;
    
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return reply.code(400).send({ error: 'Text body is required' });
    }

    const { justifiedText, wordCount } = justify(text, 80);
    const canProceed = incrementWordCount(token, wordCount);
    
    if (!canProceed) {
      return reply.code(402).send({ error: 'Daily word limit exceeded' });
    }

    return reply
      .header('Content-Type', 'text/plain')
      .send(justifiedText);
      
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ error: 'Internal server error' });
  }
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000');
    await fastify.listen({ port, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
