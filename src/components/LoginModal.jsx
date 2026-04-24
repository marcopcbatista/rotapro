import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Mail, Lock, Package, ArrowRight, AlertCircle, UserPlus, LogIn as LogInIcon } from 'lucide-react';

export default function LoginModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError('Preencha todos os campos.');
    if (password.length < 6) return setError('A senha deve ter pelo menos 6 caracteres.');

    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose?.();
    } catch (err) {
      const errorMessages = {
        'auth/user-not-found': 'Usuário não encontrado. Crie uma conta.',
        'auth/wrong-password': 'Senha incorreta. Tente novamente.',
        'auth/invalid-credential': 'E-mail ou senha inválidos.',
        'auth/email-already-in-use': 'Este e-mail já está em uso.',
        'auth/weak-password': 'A senha é muito fraca.',
        'auth/invalid-email': 'E-mail inválido.',
        'auth/too-many-requests': 'Muitas tentativas. Aguarde um momento.',
      };
      setError(errorMessages[err.code] || `Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-modal animate-fade-in-scale" onClick={(e) => e.stopPropagation()}>
        {/* Brand */}
        <div className="flex items-center gap-3 mb-6">
          <div className="sidebar-brand-icon">
            <Package size={22} color="white" />
          </div>
          <div>
            <h2 style={{ marginBottom: 0 }}>
              {isSignUp ? 'Criar Conta' : 'Bem-vindo de volta'}
            </h2>
          </div>
        </div>
        
        <p className="login-subtitle">
          {isSignUp 
            ? 'Crie sua conta para otimizar suas rotas de entrega.' 
            : 'Entre para acessar suas rotas e entregas salvas.'}
        </p>

        {error && (
          <div className="login-error mb-4">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>E-mail</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                id="login-email"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Senha</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} className="input-icon" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="login-password"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary w-full py-4"
            disabled={loading}
            id="login-submit"
            style={{ marginTop: '8px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <div className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
            ) : (
              <>
                {isSignUp ? <UserPlus size={18} /> : <LogInIcon size={18} />}
                {isSignUp ? 'Criar Conta' : 'Entrar'}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="login-divider">
          <span>{isSignUp ? 'Já tem conta?' : 'Não tem conta?'}</span>
        </div>

        <button 
          type="button"
          onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
          className="btn-ghost w-full"
          style={{ textAlign: 'center', padding: '12px', fontSize: '0.813rem' }}
          id="login-toggle"
        >
          {isSignUp ? 'Fazer Login' : 'Criar Conta Grátis'}
        </button>
      </div>
    </div>
  );
}
