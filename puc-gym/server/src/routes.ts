import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { Router, type Response } from 'express';
import { z } from 'zod';
import { requireAuth, requireInstructor, signToken, toPublic, type AuthenticatedRequest } from './auth';
import { getDb, listGroups, saveDb } from './db';
import type { Exercise, HistoryEntry } from './types';

export const router = Router();

const passwordSchema = z
  .string()
  .min(8, 'A senha deve ter no mínimo 8 caracteres.')
  .regex(/[A-Za-z]/, 'A senha deve conter letras.')
  .regex(/[0-9]/, 'A senha deve conter números.');

const signUpSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome.'),
  email: z.string().trim().email('Informe um e-mail válido.'),
  password: passwordSchema,
});

const signInSchema = z.object({
  email: z.string().trim().email('Informe um e-mail válido.'),
  password: z.string().min(1, 'Informe a senha.'),
});

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome.'),
  avatar: z.string().nullable().optional(),
});

const passwordChangeSchema = z.object({
  oldPassword: z.string().min(1, 'Informe a senha atual.'),
  newPassword: passwordSchema,
});

const exerciseSchema = z.object({
  name: z.string().trim().min(2),
  group: z.string().trim().min(2),
  series: z.number().int().positive(),
  repetitions: z.number().int().positive(),
  thumb: z.string().min(1),
  demo: z.string().min(1),
});

function fail(res: Response, status: number, message: string): void {
  res.status(status).json({ message });
}

function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'Dados inválidos.';
}

router.post('/users', (req, res) => {
  const parsed = signUpSchema.safeParse(req.body);
  if (!parsed.success) {
    fail(res, 400, firstIssue(parsed.error));
    return;
  }
  const db = getDb();
  const email = parsed.data.email.toLowerCase();
  if (db.users.some((user) => user.email === email)) {
    fail(res, 409, 'Já existe uma conta com este e-mail.');
    return;
  }
  const user = {
    id: randomUUID(),
    name: parsed.data.name,
    email,
    passwordHash: bcrypt.hashSync(parsed.data.password, 8),
    avatar: null,
    role: 'aluno' as const,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  saveDb();
  res.status(201).json({ user: toPublic(user), token: signToken(user) });
});

router.post('/sessions', (req, res) => {
  const parsed = signInSchema.safeParse(req.body);
  if (!parsed.success) {
    fail(res, 400, firstIssue(parsed.error));
    return;
  }
  const user = getDb().users.find((item) => item.email === parsed.data.email.toLowerCase());
  if (!user || !bcrypt.compareSync(parsed.data.password, user.passwordHash)) {
    fail(res, 401, 'E-mail ou senha incorretos.');
    return;
  }
  res.json({ user: toPublic(user), token: signToken(user) });
});

router.get('/me', requireAuth, (req: AuthenticatedRequest, res) => {
  res.json({ user: toPublic(req.user!) });
});

router.put('/me', requireAuth, (req: AuthenticatedRequest, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) {
    fail(res, 400, firstIssue(parsed.error));
    return;
  }
  const user = req.user!;
  user.name = parsed.data.name;
  if (parsed.data.avatar !== undefined) {
    user.avatar = parsed.data.avatar;
  }
  saveDb();
  res.json({ user: toPublic(user) });
});

router.put('/me/password', requireAuth, (req: AuthenticatedRequest, res) => {
  const parsed = passwordChangeSchema.safeParse(req.body);
  if (!parsed.success) {
    fail(res, 400, firstIssue(parsed.error));
    return;
  }
  const user = req.user!;
  if (!bcrypt.compareSync(parsed.data.oldPassword, user.passwordHash)) {
    fail(res, 400, 'A senha atual está incorreta.');
    return;
  }
  user.passwordHash = bcrypt.hashSync(parsed.data.newPassword, 8);
  saveDb();
  res.json({ message: 'Senha alterada com sucesso.' });
});

router.get('/groups', requireAuth, (_req, res) => {
  res.json({ groups: listGroups() });
});

router.get('/exercises', requireAuth, (req, res) => {
  const group = typeof req.query.group === 'string' ? req.query.group : '';
  const exercises = getDb().exercises.filter((item) => item.active && (group === '' || item.group === group));
  res.json({ exercises });
});

router.get('/exercises/:id', requireAuth, (req, res) => {
  const exercise = getDb().exercises.find((item) => item.id === req.params.id && item.active);
  if (!exercise) {
    fail(res, 404, 'Exercício não encontrado.');
    return;
  }
  res.json({ exercise });
});

router.post('/history', requireAuth, (req: AuthenticatedRequest, res) => {
  const exerciseId = typeof req.body?.exerciseId === 'string' ? req.body.exerciseId : '';
  const db = getDb();
  const exercise = db.exercises.find((item) => item.id === exerciseId && item.active);
  if (!exercise) {
    fail(res, 404, 'Exercício não encontrado.');
    return;
  }
  const entry: HistoryEntry = {
    id: randomUUID(),
    userId: req.user!.id,
    exerciseId,
    createdAt: new Date().toISOString(),
  };
  db.history.push(entry);
  saveDb();
  res.status(201).json({ entry, message: 'Parabéns! Exercício registrado no seu histórico.' });
});

interface HistoryItem {
  id: string;
  name: string;
  group: string;
  createdAt: string;
}

interface HistoryDay {
  date: string;
  items: HistoryItem[];
}

router.get('/history', requireAuth, (req: AuthenticatedRequest, res) => {
  const db = getDb();
  const entries = db.history
    .filter((item) => item.userId === req.user!.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const days: HistoryDay[] = [];
  for (const entry of entries) {
    const exercise = db.exercises.find((item) => item.id === entry.exerciseId);
    if (!exercise) {
      continue;
    }
    const date = entry.createdAt.slice(0, 10);
    let day = days.find((item) => item.date === date);
    if (!day) {
      day = { date, items: [] };
      days.push(day);
    }
    day.items.push({ id: entry.id, name: exercise.name, group: exercise.group, createdAt: entry.createdAt });
  }
  res.json({ days });
});

router.post('/exercises', requireAuth, requireInstructor, (req, res) => {
  const parsed = exerciseSchema.safeParse(req.body);
  if (!parsed.success) {
    fail(res, 400, firstIssue(parsed.error));
    return;
  }
  const exercise: Exercise = { id: randomUUID(), ...parsed.data, active: true };
  getDb().exercises.push(exercise);
  saveDb();
  res.status(201).json({ exercise });
});

router.put('/exercises/:id', requireAuth, requireInstructor, (req, res) => {
  const parsed = exerciseSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    fail(res, 400, firstIssue(parsed.error));
    return;
  }
  const exercise = getDb().exercises.find((item) => item.id === req.params.id);
  if (!exercise) {
    fail(res, 404, 'Exercício não encontrado.');
    return;
  }
  Object.assign(exercise, parsed.data);
  saveDb();
  res.json({ exercise });
});

router.delete('/exercises/:id', requireAuth, requireInstructor, (req, res) => {
  const exercise = getDb().exercises.find((item) => item.id === req.params.id);
  if (!exercise) {
    fail(res, 404, 'Exercício não encontrado.');
    return;
  }
  exercise.active = false;
  saveDb();
  res.status(204).end();
});

router.get('/frequency', requireAuth, requireInstructor, (_req, res) => {
  const db = getDb();
  const students = db.users
    .filter((user) => user.role === 'aluno')
    .map((user) => {
      const entries = db.history.filter((item) => item.userId === user.id);
      const days = new Set(entries.map((item) => item.createdAt.slice(0, 10)));
      const last = entries.map((item) => item.createdAt).sort().at(-1) ?? null;
      return { id: user.id, name: user.name, email: user.email, days: days.size, exercises: entries.length, lastTraining: last };
    });
  res.json({ students });
});
