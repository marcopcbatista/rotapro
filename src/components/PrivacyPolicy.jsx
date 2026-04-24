import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Database, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: <Lock size={20} />,
      title: 'Compromisso com sua Segurança',
      content: 'O RotaPro coleta dados de localização e endereço exclusivamente para gerar rotas otimizadas e facilitar o seu trabalho de entregas. Utilizamos criptografia de ponta a ponta e seguimos as melhores práticas de segurança da indústria.'
    },
    {
      icon: <Eye size={20} />,
      title: 'Uso de Dados',
      content: 'Nós não compartilhamos seus endereços de entrega ou dados pessoais com terceiros para fins de marketing ou publicidade. Todos os dados são utilizados exclusivamente dentro da infraestrutura do app para fornecer o serviço de roteirização.'
    },
    {
      icon: <Database size={20} />,
      title: 'Armazenamento',
      content: 'Seus dados são armazenados no Google Firebase, com infraestrutura de nível empresarial e conformidade SOC 2 Type II, ISO 27001 e ISO 27017. Os dados são replicados em múltiplas regiões para garantir disponibilidade.'
    },
    {
      icon: <Shield size={20} />,
      title: 'Cookies e Sessão',
      content: 'Utilizamos armazenamento local (LocalStorage) e autenticação via Firebase para manter você logado e garantir que seus dados de rota persistam entre as sessões. Não utilizamos cookies de rastreamento de terceiros.'
    },
    {
      icon: <Mail size={20} />,
      title: 'Comunicações',
      content: 'Enviamos apenas e-mails transacionais relacionados à sua conta, como confirmações de assinatura e atualizações importantes. Você pode optar por não receber comunicações a qualquer momento.'
    },
  ];

  return (
    <div style={{ flex: 1, background: 'var(--bg-main)', minHeight: '100vh', overflowY: 'auto' }} className="animate-fade-in">
      <div className="max-w-3xl mx-auto" style={{ padding: '32px 24px' }}>
        <button 
          onClick={() => navigate('/')} 
          className="btn-ghost mb-8" 
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px' }}
          id="privacy-back"
        >
          <ArrowLeft size={18} /> Voltar para o App
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{ 
            padding: 14, 
            background: 'var(--primary-glow)', 
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <Shield style={{ color: 'var(--primary)' }} size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black" style={{ letterSpacing: '-0.03em' }}>Política de Privacidade</h1>
            <p className="text-sm text-muted" style={{ marginTop: 4 }}>Última atualização: 23 de Abril de 2026</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {sections.map((section, i) => (
            <div 
              key={i} 
              className="card animate-fade-in" 
              style={{ 
                padding: 28,
                animationDelay: `${i * 0.08}s`,
                animationFillMode: 'backwards'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ 
                  color: 'var(--primary)', 
                  padding: 8, 
                  background: 'var(--primary-glow)', 
                  borderRadius: 'var(--radius-sm)' 
                }}>
                  {section.icon}
                </div>
                <h2 className="text-lg font-bold">{section.title}</h2>
              </div>
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)', fontSize: '0.938rem' }}>
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div style={{ 
          marginTop: 32, 
          padding: '24px', 
          borderTop: '1px solid var(--border)',
          textAlign: 'center' 
        }}>
          <p className="text-xs text-muted">
            © 2026 RotaPro — Roteirização Inteligente de Entregas
          </p>
          <p className="text-xs text-muted" style={{ marginTop: 4 }}>
            Dúvidas? Entre em contato: suporte@rotapro.app
          </p>
        </div>
      </div>
    </div>
  );
}
