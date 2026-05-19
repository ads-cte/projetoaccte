import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export const constAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: 'Token não fornecido',
    });
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    return res.status(401).json({
      message: 'Token não fornecido',
    });
  }

  try {
    const secret = process.env.SECRET_KEY as string;

    const decoded = jwt.verify(token, secret);

    if (typeof decoded === 'object' && decoded !== null) {
      const payload = decoded as TokenPayload;

      req.user = {
        id: payload.id,
        email: payload.email,
      };
    }

    return next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token inválido ou expirado',
    });
  }
};