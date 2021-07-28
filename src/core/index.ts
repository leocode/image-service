import fastify from 'fastify';
import config from '../config';
import { imageController } from './image-controller';
import { videoController } from './video-controller';

const server = fastify({ logger: true });

server.register(require('fastify-boom'));
server.register(require('fastify-file-upload'));

server.register(imageController, { prefix: '/image' });
server.register(videoController, { prefix: '/video' });

const start = async () => {
  try {
    await server.listen(config.port);
  } catch (err: unknown) {
    server.log.error(err);

    process.exit(1);
  }
};

start();
