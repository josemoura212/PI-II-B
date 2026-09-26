import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getDb } from './db';
import type { PublicUser, User } from './types';

const secret = process.env.JWT_SECRET ?? 'puc-gym-dev-secret';
const expiresIn = '7d';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function signToken(user: User): string {
  return jwt.sign({ sub: user.id, role: user.role }, secret, { expiresIn });
}

export function toPublic(user: User): PublicUser {
  return { id: user.id, name: user.name, email: user.email, avatar: user.avatar, role: user.role };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) {
    res.status(401).json({ message: 'Faça login para continuar.' });
    return;
  }
  try {
    const payload = jwt.verify(token, secret) as { sub: string };
    const user = getDb().users.find((item) => item.id === payload.sub);
    if (!user) {
      res.status(401).json({ message: 'Sessão inválida. Faça login novamente.' });
      return;
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Sessão expirada. Faça login novamente.' });
  }
}

export function requireInstructor(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (req.user?.role !== 'instrutor') {
    res.status(403).json({ message: 'Apenas o instrutor pode fazer isso.' });
    return;
  }
  next();
}
