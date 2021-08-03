import type { AdapterResult } from '../../adapters/adapter.types';
import type { FastifyReply } from 'fastify';
import Boom from 'boom';

export const handleResponse = async (adapterResult: AdapterResult, reply: FastifyReply): Promise<void> => {
  if (adapterResult.file) {
    reply
      .send(adapterResult.file)
    ;
    return;
  }
  // TODO: sending other info not implemented yet
  throw Boom.notImplemented('Not implemented yet!');
};