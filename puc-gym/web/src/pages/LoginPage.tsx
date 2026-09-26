import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { Button, Input, Logo, Toast } from '../components/ui';

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app auth">
      <div className="auth__bg" />
      <div className="auth__content">
        <Logo />
        <form className="form" onSubmit={handleSubmit}>
          <h2 className="form__title">Acesse sua conta</h2>
          <Input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          <Button type="submit" disabled={busy}>{busy ? 'Entrando…' : 'Acessar'}</Button>
          <Toast message={error} />
        </form>
        <div className="auth__footer">
          <span>Ainda não tem acesso?</span>
          <Button variant="outline" type="button" onClick={() => navigate('/cadastro')}>Criar conta</Button>
        </div>
      </div>
    </div>
  );
}
