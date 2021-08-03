import fastify from 'fastify';
import config from '../config';
import { imageController } from './image/image.controller';
import { videoController } from './video/video.controller';
import fastifyMultipart from 'fastify-multipart';

const server = fastify({ logger: true });

server.register(require('fastify-boom'));
server.register(fastifyMultipart);

server.register(imageController, { prefix: '/images' });
server.register(videoController, { prefix: '/videos' });

const start = async () => {
  try {
    await server.listen(config.port);
  } catch (err: unknown) {
    server.log.error(err);

    process.exit(1);
  }
};

start();
