import type {FastifyInstance} from 'fastify';
import type {FastifySchema} from 'fastify/types/schema';

export interface CommonHandlerParams {
  path: string,
  fastify: FastifyInstance,
  options: { baseSchema: FastifySchema },
}
