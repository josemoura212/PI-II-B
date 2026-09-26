import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, type Exercise } from '../api';
import { ArrowLeftIcon, BodyIcon, RepeatIcon, SeriesIcon } from '../components/icons';
import { BottomNav, Button, Toast } from '../components/ui';

export function ExercisePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<{ exercise: Exercise }>(`/exercises/${id}`)
      .then((data) => setExercise(data.exercise))
      .catch((err: Error) => setError(err.message));
  }, [id]);

  async function markDone() {
    setError(null);
    setBusy(true);
    try {
      const data = await api<{ message: string }>('/history', { method: 'POST', body: { exerciseId: id } });
      setSuccess(data.message);
      setTimeout(() => navigate('/historico'), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível registrar.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app">
      <header className="exercise-header">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Voltar">
          <ArrowLeftIcon />
        </button>
        <div className="exercise-header__row">
          <h1>{exercise?.name ?? '…'}</h1>
          <span className="exercise-header__group">
            <BodyIcon /> {exercise?.group ?? ''}
          </span>
        </div>
      </header>

      <main className="content">
        <Toast message={error} />
        {exercise ? (
          <>
            <img className="exercise-demo" src={exercise.demo} alt={`Demonstração: ${exercise.name}`} />
            <div className="exercise-detail">
              <div className="exercise-detail__info">
                <span><SeriesIcon /> {exercise.series} séries</span>
                <span><RepeatIcon /> {exercise.repetitions} repetições</span>
              </div>
              <Button onClick={markDone} disabled={busy || success !== null}>
                {busy ? 'Registrando…' : 'Marcar como realizado'}
              </Button>
              <Toast message={success} kind="success" />
            </div>
          </>
        ) : null}
      </main>
      <BottomNav />
    </div>
  );
}
