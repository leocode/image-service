import fastify from 'fastify';
import config from '../config';
import { imageController } from './image/image.controller';
import { videoController } from './video/video.controller';
import fastifyMultipart from 'fastify-multipart';
import { setupSwagger } from '../docs/setup-swagger';

function ajvPlugin(ajv: any) {
  ajv.addFormat('binary', { type: 'string', validate: () => true });

  return ajv;
}
const server = fastify({ logger: true, ajv: { plugins: [ajvPlugin] } });

server.register(require('fastify-boom'));
server.register(fastifyMultipart);
setupSwagger(server);

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
