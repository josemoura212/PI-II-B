import { useEffect, useState } from 'react';
import { api, type HistoryDay } from '../api';
import { BottomNav, Header, Toast } from '../components/ui';

function formatDate(date: string): string {
  const [year, month, day] = date.split('-');
  return `${day}.${month}.${year.slice(2)}`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function HistoryPage() {
  const [days, setDays] = useState<HistoryDay[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api<{ days: HistoryDay[] }>('/history')
      .then((data) => setDays(data.days))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoaded(true));
  }, []);

  return (
    <div className="app">
      <Header title="Histórico de Exercícios" />
      <main className="content">
        <Toast message={error} />
        {loaded && days.length === 0 && !error ? (
          <p className="empty">Não há exercícios registrados ainda.<br />Vamos treinar hoje?</p>
        ) : null}
        {days.map((day) => (
          <section key={day.date} className="history-day">
            <h2>{formatDate(day.date)}</h2>
            {day.items.map((item) => (
              <div key={item.id} className="history-card">
                <div>
                  <strong>{item.group}</strong>
                  <span>{item.name}</span>
                </div>
                <time>{formatTime(item.createdAt)}</time>
              </div>
            ))}
          </section>
        ))}
      </main>
      <BottomNav />
    </div>
  );
}
