import { useState, type ChangeEvent, type FormEvent } from 'react';
import { api, type User } from '../api';
import { useAuth } from '../auth';
import { Avatar, BottomNav, Button, Header, Input, Toast } from '../components/ui';

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
    reader.readAsDataURL(file);
  });
}

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user!.name);
  const [avatar, setAvatar] = useState<string | null>(user!.avatar);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (file.size > 1024 * 1024) {
      setError('Escolha uma imagem de até 1 MB.');
      return;
    }
    setAvatar(await readAsDataUrl(file));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setBusy(true);
    try {
      const data = await api<{ user: User }>('/me', { method: 'PUT', body: { name, avatar } });
      updateUser(data.user);
      if (oldPassword || newPassword) {
        await api('/me/password', { method: 'PUT', body: { oldPassword, newPassword } });
        setOldPassword('');
        setNewPassword('');
      }
      setSuccess('Perfil atualizado com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível atualizar.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app">
      <Header title="Perfil" />
      <main className="content">
        <form className="form profile" onSubmit={handleSubmit}>
          <div className="profile__avatar">
            <Avatar src={avatar} name={name} size={148} />
            <label className="link">
              Alterar foto
              <input type="file" accept="image/*" onChange={handleAvatar} hidden />
            </label>
          </div>
          <Input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input value={user!.email} disabled />
          <h3 className="form__subtitle">Alterar senha</h3>
          <Input type="password" placeholder="Senha antiga" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} autoComplete="current-password" />
          <Input type="password" placeholder="Nova senha" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" />
          <Button type="submit" disabled={busy}>{busy ? 'Atualizando…' : 'Atualizar'}</Button>
          <Toast message={error} />
          <Toast message={success} kind="success" />
        </form>
      </main>
      <BottomNav />
    </div>
  );
}
