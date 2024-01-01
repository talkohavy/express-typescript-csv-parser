import type { NextFunction, Request, Response } from 'express';

function checkIsAuthAdminMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.headers['x-auth-admin'] === 'admin') return next();

    throw new Error('ForbiddenError::access to this resource is forbidden');
  } catch (error) {
    next(error);
  }
}

export { checkIsAuthAdminMiddleware };
