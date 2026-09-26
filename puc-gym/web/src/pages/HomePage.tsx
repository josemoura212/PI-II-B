import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type Exercise } from '../api';
import { useAuth } from '../auth';
import { GroupPicker } from '../components/GroupPicker';
import { ChevronIcon, LogoutIcon } from '../components/icons';
import { Avatar, BottomNav, Toast } from '../components/ui';

export function HomePage() {
  const { user, signOut } = useAuth();
  const [groups, setGroups] = useState<string[]>([]);
  const [group, setGroup] = useState('costas');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<{ groups: string[] }>('/groups')
      .then((data) => setGroups(data.groups))
      .catch((err: Error) => setError(err.message));
  }, []);

  useEffect(() => {
    setError(null);
    api<{ exercises: Exercise[] }>(`/exercises?group=${encodeURIComponent(group)}`)
      .then((data) => setExercises(data.exercises))
      .catch((err: Error) => setError(err.message));
  }, [group]);

  return (
    <div className="app">
      <header className="home-header">
        <Avatar src={user!.avatar} name={user!.name} />
        <div className="home-header__greeting">
          <span>Olá,</span>
          <strong>{user!.name}</strong>
        </div>
        <button className="icon-btn" onClick={signOut} aria-label="Sair">
          <LogoutIcon />
        </button>
      </header>

      <GroupPicker groups={groups} selected={group} onSelect={setGroup} />

      <main className="content">
        <div className="section-title">
          <span>Exercícios</span>
          <span>{exercises.length}</span>
        </div>
        <Toast message={error} />
        {exercises.length === 0 && !error ? (
          <p className="empty">Nenhum exercício cadastrado para este grupo.</p>
        ) : null}
        <ul className="exercise-list">
          {exercises.map((item) => (
            <li key={item.id}>
              <Link to={`/exercicio/${item.id}`} className="exercise-card">
                <img className="exercise-card__thumb" src={item.thumb} alt="" />
                <div className="exercise-card__info">
                  <strong>{item.name}</strong>
                  <span>{item.series} séries x {item.repetitions} repetições</span>
                </div>
                <ChevronIcon />
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <BottomNav />
    </div>
  );
}
