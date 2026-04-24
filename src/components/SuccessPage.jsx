import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Infinity, Camera, Headphones, Zap, ArrowRight } from 'lucide-react';

export default function SuccessPage() {
  const navigate = useNavigate();

  const features = [
    { icon: <Infinity size={18} />, label: 'Rotas Ilimitadas', color: '#3b82f6' },
    { icon: <Camera size={18} />, label: 'OCR Avançado', color: '#8b5cf6' },
    { icon: <Headphones size={18} />, label: 'Suporte Priority', color: '#10b981' },
    { icon: <Zap size={18} />, label: 'Sem Anúncios', color: '#f59e0b' },
  ];

  return (
    <div className="success-page animate-fade-in">
      <div className="success-icon">
        <CheckCircle size={48} color="white" />
      </div>

      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 900, 
        letterSpacing: '-0.03em',
        marginBottom: '8px'
      }}>
        Assinatura Ativada! 🎉
      </h1>
      
      <p style={{ 
        color: 'var(--text-muted)', 
        fontSize: '1rem',
        maxWidth: '400px',
        lineHeight: 1.6
      }}>
        Parabéns! Seu plano <strong style={{ color: 'var(--primary)' }}>RotaPro Premium</strong> está ativo. 
        Aproveite todos os recursos profissionais.
      </p>

      <div className="success-features">
        {features.map((f, i) => (
          <div key={i} className="success-feature" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="success-feature-icon" style={{ background: `${f.color}15`, color: f.color }}>
              {f.icon}
            </div>
            <span>{f.label}</span>
          </div>
        ))}
      </div>

      <button 
        onClick={() => navigate('/')} 
        className="btn-primary"
        style={{ marginTop: '40px', padding: '16px 32px', fontSize: '1rem' }}
        id="success-go-home"
      >
        Começar a Usar
        <ArrowRight size={20} />
      </button>
    </div>
  );
}
