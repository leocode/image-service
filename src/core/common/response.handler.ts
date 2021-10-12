import type { AdapterResult } from '../../adapters/adapter.types';
import type { FastifyReply } from 'fastify';
import Boom from 'boom';

export const handleResponse = async (adapterResult: AdapterResult, reply: FastifyReply): Promise<void> => {
  if (adapterResult.file) {
    if (adapterResult?.info?.contentType) {
      reply.header('Content-Type', adapterResult.info.contentType)
    }
    if (adapterResult?.info?.fileName) {
      reply.header('Content-Disposition', 'inline; filename="' + adapterResult.info.fileName + '"')
    }
    reply
      .send(adapterResult.file)
    ;
    return;
  }
  // TODO: sending other info not implemented yet
  throw Boom.notImplemented('Not implemented yet!');
};
