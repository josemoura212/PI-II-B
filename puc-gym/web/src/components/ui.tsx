import { NavLink } from 'react-router-dom';
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { BarbellIcon, HistoryIcon, HomeIcon, UserIcon } from './icons';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline';
  children: ReactNode;
}

export function Button({ variant = 'solid', children, className = '', ...rest }: ButtonProps) {
  return (
    <button className={`btn btn--${variant} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="input" {...props} />;
}

export function Logo() {
  return (
    <div className="logo">
      <div className="logo__row">
        <BarbellIcon />
        <span className="logo__name">PUC Gym</span>
      </div>
      <span className="logo__tagline">Treine sua mente e o seu corpo</span>
    </div>
  );
}

interface ToastProps {
  message: string | null;
  kind?: 'error' | 'success';
}

export function Toast({ message, kind = 'error' }: ToastProps) {
  if (!message) {
    return null;
  }
  return <div className={`toast toast--${kind}`}>{message}</div>;
}

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className="bottom-nav__item" aria-label="Início">
        <HomeIcon />
      </NavLink>
      <NavLink to="/historico" className="bottom-nav__item" aria-label="Histórico">
        <HistoryIcon />
      </NavLink>
      <NavLink to="/perfil" className="bottom-nav__item" aria-label="Perfil">
        <UserIcon />
      </NavLink>
    </nav>
  );
}

interface HeaderProps {
  title: string;
  left?: ReactNode;
  right?: ReactNode;
}

export function Header({ title, left, right }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__side">{left}</div>
      <h1 className="header__title">{title}</h1>
      <div className="header__side header__side--right">{right}</div>
    </header>
  );
}

export function Avatar({ src, name, size = 64 }: { src: string | null; name: string; size?: number }) {
  if (src) {
    return <img className="avatar" src={src} alt={name} style={{ width: size, height: size }} />;
  }
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase();
  return (
    <div className="avatar avatar--fallback" style={{ width: size, height: size, fontSize: size / 2.6 }}>
      {initials}
    </div>
  );
}
