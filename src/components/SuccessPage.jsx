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
    <div className="success-page animate-fade-in-scale">
      <div className="success-icon glow-pulse">
        <CheckCircle size={56} color="white" />
      </div>

      <h1 className="text-gradient" style={{ 
        fontSize: '2.5rem', 
        fontWeight: 950, 
        letterSpacing: '-0.04em',
        marginBottom: '12px'
      }}>
        Bem-vindo ao Elite! 🏆
      </h1>
      
      <p style={{ 
        color: 'var(--text-secondary)', 
        fontSize: '1.125rem',
        maxWidth: '500px',
        lineHeight: 1.6,
        fontWeight: 500,
        marginBottom: '40px'
      }}>
        Seu plano <strong className="text-gradient">RotaPro Premium</strong> foi ativado com sucesso. 
        Sua conta agora tem superpoderes logísticos.
      </p>

      <div className="success-features">
        {features.map((f, i) => (
          <div key={i} className="success-feature card" style={{ animationDelay: `${i * 0.1}s`, borderLeft: `4px solid ${f.color}` }}>
            <div className="success-feature-icon" style={{ background: `${f.color}20`, color: f.color }}>
              {f.icon}
            </div>
            <span style={{ fontWeight: 700 }}>{f.label}</span>
          </div>
        ))}
      </div>

      <button 
        onClick={() => navigate('/')} 
        className="btn-primary"
        style={{ marginTop: '56px', padding: '18px 48px', fontSize: '1.125rem' }}
        id="success-go-home"
      >
        Acessar Painel PRO
        <ArrowRight size={22} />
      </button>
    </div>
  );
}
