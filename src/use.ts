import { NextApiRequest, NextApiResponse } from 'next';
import { runMiddlewares } from './run-middlewares';
import { Middleware } from './types';

export function use<RequestT extends NextApiRequest>(...middlewares: Middleware<RequestT>[]) {
  return async function internalHandler(req: RequestT, res: NextApiResponse) {
    await runMiddlewares<RequestT>(req, res, middlewares, 0);
  };
}
