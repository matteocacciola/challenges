import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const verifyTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Not Authorized' });
  }

  try {
    jwt.verify(token, process.env.SECRET);
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Forbidden' });
  }
};
