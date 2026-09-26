import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth';
import { ExercisePage } from './pages/ExercisePage';
import { HistoryPage } from './pages/HistoryPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { SignUpPage } from './pages/SignUpPage';

export function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="app app--center">Carregando…</div>;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<SignUpPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/exercicio/:id" element={<ExercisePage />} />
      <Route path="/historico" element={<HistoryPage />} />
      <Route path="/perfil" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
