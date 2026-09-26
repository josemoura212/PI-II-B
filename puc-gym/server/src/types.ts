export type Role = 'aluno' | 'instrutor';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatar: string | null;
  role: Role;
  createdAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  group: string;
  series: number;
  repetitions: number;
  thumb: string;
  demo: string;
  active: boolean;
}

export interface HistoryEntry {
  id: string;
  userId: string;
  exerciseId: string;
  createdAt: string;
}

export interface Database {
  users: User[];
  exercises: Exercise[];
  history: HistoryEntry[];
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: Role;
}
