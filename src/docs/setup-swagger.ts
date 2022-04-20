import type { FastifyInstance } from 'fastify';
import fastifySwagger from 'fastify-swagger';
import { version as packageVersion } from '../../package.json';

export const setupSwagger = (server: FastifyInstance) => {
  server.register(fastifySwagger, {
    routePrefix: '/docs',
    swagger: {
      info: {
        title: 'Image Service',
        version: packageVersion,
      },
    },
    exposeRoute: true,
  });
};
