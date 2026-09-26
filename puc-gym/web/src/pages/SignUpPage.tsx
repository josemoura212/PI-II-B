import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { Button, Input, Logo, Toast } from '../components/ui';

export function SignUpPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('As senhas não conferem.');
      return;
    }
    setBusy(true);
    try {
      await signUp(name, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar a conta.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app auth auth--signup">
      <div className="auth__bg" />
      <div className="auth__content">
        <Logo />
        <form className="form" onSubmit={handleSubmit}>
          <h2 className="form__title">Crie sua conta</h2>
          <Input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
          <Input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />
          <Input type="password" placeholder="Confirme a Senha" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
          <Button type="submit" disabled={busy}>{busy ? 'Criando…' : 'Criar e acessar'}</Button>
          <Toast message={error} />
        </form>
        <div className="auth__footer">
          <Button variant="outline" type="button" onClick={() => navigate('/login')}>Voltar para o login</Button>
        </div>
      </div>
    </div>
  );
}
