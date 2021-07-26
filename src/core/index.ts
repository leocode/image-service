import fastify from 'fastify';
import config from '../config';

const server = fastify({ logger: true });

server.register(require('fastify-boom'));
server.register(require('fastify-file-upload'));

server.register(require('./image-routes'), { prefix: '/image' });
server.register(require('./video-routes'), { prefix: '/video' });

const start = async () => {
  try {
    await server.listen(config.port);
  } catch (err: unknown) {
    server.log.error(err);

    process.exit(1);
  }
};

start();
