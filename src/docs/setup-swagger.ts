import type { FastifyInstance } from 'fastify';
import fastifySwagger from 'fastify-swagger';

export const setupSwagger = (server: FastifyInstance) => {

  server.register(fastifySwagger, {
    routePrefix: '/docs',
    swagger: {
      info: {
        title: 'Image Service',
        version: require('../../package.json').version,
      },
    },
    exposeRoute: true,
  });
};
