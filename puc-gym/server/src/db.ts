import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import type { Database, Exercise, User } from './types';

const dataDir = path.resolve(__dirname, '..', 'data');
const dbFile = path.join(dataDir, 'db.json');

const groups = ['costas', 'bíceps', 'tríceps', 'ombro', 'peito', 'pernas', 'abdômen'];

interface SeedExercise {
  name: string;
  group: string;
  thumb: string;
}

const seedExercises: SeedExercise[] = [
  { name: 'Puxada frontal', group: 'costas', thumb: 'puxada-frontal' },
  { name: 'Remada curvada', group: 'costas', thumb: 'remada-curvada' },
  { name: 'Remada unilateral', group: 'costas', thumb: 'remada-unilateral' },
  { name: 'Levantamento terra', group: 'costas', thumb: 'levantamento-terra' },
  { name: 'Rosca direta', group: 'bíceps', thumb: 'remada-curvada' },
  { name: 'Rosca alternada', group: 'bíceps', thumb: 'remada-unilateral' },
  { name: 'Rosca martelo', group: 'bíceps', thumb: 'puxada-frontal' },
  { name: 'Tríceps testa', group: 'tríceps', thumb: 'levantamento-terra' },
  { name: 'Tríceps corda', group: 'tríceps', thumb: 'puxada-frontal' },
  { name: 'Mergulho no banco', group: 'tríceps', thumb: 'remada-curvada' },
  { name: 'Elevação lateral', group: 'ombro', thumb: 'remada-unilateral' },
  { name: 'Desenvolvimento', group: 'ombro', thumb: 'puxada-frontal' },
  { name: 'Elevação frontal', group: 'ombro', thumb: 'levantamento-terra' },
  { name: 'Supino reto', group: 'peito', thumb: 'remada-curvada' },
  { name: 'Crucifixo', group: 'peito', thumb: 'remada-unilateral' },
  { name: 'Agachamento livre', group: 'pernas', thumb: 'levantamento-terra' },
  { name: 'Leg press', group: 'pernas', thumb: 'puxada-frontal' },
  { name: 'Abdominal supra', group: 'abdômen', thumb: 'remada-curvada' },
  { name: 'Prancha', group: 'abdômen', thumb: 'remada-unilateral' },
];

function buildSeed(): Database {
  const now = new Date().toISOString();
  const users: User[] = [
    {
      id: randomUUID(),
      name: 'Carlos Henrique Dutra',
      email: 'instrutor@pucgym.com',
      passwordHash: bcrypt.hashSync('12345678', 8),
      avatar: null,
      role: 'instrutor',
      createdAt: now,
    },
    {
      id: randomUUID(),
      name: 'Guilherme Ganim',
      email: 'guilherme@email.com',
      passwordHash: bcrypt.hashSync('12345678', 8),
      avatar: '/img/avatar.png',
      role: 'aluno',
      createdAt: now,
    },
  ];
  const exercises: Exercise[] = seedExercises.map((item) => ({
    id: randomUUID(),
    name: item.name,
    group: item.group,
    series: 3,
    repetitions: 12,
    thumb: `/img/${item.thumb}.png`,
    demo: '/img/puxada-frontal-demo.png',
    active: true,
  }));
  return { users, exercises, history: [] };
}

let database: Database | null = null;

function load(): Database {
  if (database) {
    return database;
  }
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (fs.existsSync(dbFile)) {
    database = JSON.parse(fs.readFileSync(dbFile, 'utf8')) as Database;
  } else {
    database = buildSeed();
    persist();
  }
  return database;
}

function persist(): void {
  if (!database) {
    return;
  }
  fs.writeFileSync(dbFile, JSON.stringify(database, null, 2));
}

export function getDb(): Database {
  return load();
}

export function saveDb(): void {
  persist();
}

export function listGroups(): string[] {
  return groups;
}
