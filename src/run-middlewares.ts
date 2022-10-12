import { NextApiRequest, NextApiResponse } from 'next';
import { ErrorHandler, Middleware } from './types';

export async function runMiddlewares<RequestT extends NextApiRequest>(
  req: RequestT,
  res: NextApiResponse,
  middlewares: Middleware<RequestT>[],
  currentMiddlewareIndex: number,
  errorHandler?: ErrorHandler
) {
  const middleware = async () => {
    // Check if previous middleware sent a response - if it did we stop execution
    if (res.headersSent) return;

    const next = async () => {
      // Get next middleware, if there is one - if there isn't we stop execution
      const nextMiddleware = middlewares[currentMiddlewareIndex + 1];
      if (!nextMiddleware) return;

      // Recursively run next middleware
      await runMiddlewares(req, res, middlewares, currentMiddlewareIndex + 1, errorHandler);
    };

    // Initializes middleware chain - the next function will
    // recursively run next middleware when called by the current middleware
    await middlewares[currentMiddlewareIndex](req, res, next);
  };

  if (errorHandler) {
    try {
      await middleware();
    } catch (error) {
      errorHandler(res, error);
    }
  } else {
    await middleware();
  }
}
