import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Check, Star, ShieldCheck, Map, Clock, 
  Fuel, ArrowRight, Smartphone, Play, 
  MessageSquare, Users, TrendingUp 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SalesPage() {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <Clock className="text-primary" />,
      title: "Economize 2h por dia",
      desc: "Nossa IA calcula a rota mais rápida em segundos, para você chegar em casa mais cedo."
    },
    {
      icon: <Fuel className="text-success" />,
      title: "Gaste menos Gasolina",
      desc: "Menos quilometragem rodada significa mais dinheiro sobrando no seu bolso no fim do mês."
    },
    {
      icon: <Smartphone className="text-accent" />,
      title: "Tudo no Celular",
      desc: "Leitura de etiquetas via câmera e integração total com Waze e Google Maps."
    }
  ];

  const testimonials = [
    {
      name: "João Silva",
      role: "Entregador Mercado Livre",
      text: "O RotaPro mudou meu dia a dia. Antes eu perdia muito tempo olhando mapa, agora é só escanear e ir!",
      stars: 5
    },
    {
      name: "Marcos Souza",
      role: "Motorista de App",
      text: "A economia de combustível no primeiro mês já pagou a assinatura anual. Vale cada centavo.",
      stars: 5
    }
  ];

  const faqs = [
    { q: "O RotaPro funciona em qualquer cidade?", a: "Sim! Utilizamos a base de dados do Google Maps, cobrindo 100% do território nacional." },
    { q: "Posso cancelar quando quiser?", a: "Com certeza. Não temos fidelidade. Você pode cancelar sua assinatura com um clique." },
    { q: "Funciona em iPhone e Android?", a: "Sim, o RotaPro é um WebApp otimizado para todos os smartphones modernos." }
  ];

  return (
    <div className="lp-container">
      {/* Mini Nav */}
      <nav style={{ padding: '24px', display: 'flex', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <Zap size={20} color="white" />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', margin: 0 }}>RotaPro</h2>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={{ padding: '80px 24px', textAlign: 'center', maxWidth: 1000, margin: '0 auto' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lp-badge"
        >
          🔥 O APP Nº 1 PARA ENTREGADORES NO BRASIL
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', lineHeight: 1, fontWeight: 950, letterSpacing: '-0.05em', marginBottom: 24 }}
        >
          Faça suas entregas na <span className="text-gradient">Metade do Tempo</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: 40, maxWidth: 700, margin: '0 auto 40px' }}
        >
          O RotaPro utiliza Inteligência Artificial para otimizar suas paradas, economizar combustível e garantir que você lucre mais em cada rota.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
        >
          <button onClick={() => navigate('/')} className="lp-btn-primary" style={{ padding: '20px 60px', fontSize: '1.25rem' }}>
            QUERO AUMENTAR MEUS LUCROS AGORA <ArrowRight size={20} />
          </button>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={14} color="#10b981" /> Teste grátis hoje • Sem cartão de crédito
          </p>
        </motion.div>
      </section>

      {/* VIDEO / APP PREVIEW Placeholder */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ 
          maxWidth: 1000, margin: '0 auto', background: '#000', borderRadius: 40, 
          aspectRatio: '16/9', border: '1px solid var(--border)', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 40px 100px rgba(0,0,0,0.5)', position: 'relative'
        }}>
          <img 
            src="https://images.unsplash.com/photo-1610494162454-d62932c95cfd?q=80&w=2000&auto=format&fit=crop" 
            alt="App Preview" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }}
          />
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <div style={{ 
              width: 80, height: 80, background: 'var(--primary)', borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
              boxShadow: '0 0 40px var(--primary-glow)', cursor: 'pointer'
            }}>
              <Play fill="white" size={32} style={{ marginLeft: 6 }} />
            </div>
            <p className="font-bold">Veja como funciona em 2 min</p>
          </div>
        </div>
      </section>

      {/* BENEFITS GRID */}
      <section style={{ padding: '100px 24px', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 900, marginBottom: 60 }}>
            Por que o RotaPro é o <span className="text-gradient">Favorito</span> dos Motoristas?
          </h2>
          <div className="lp-grid">
            {benefits.map((b, i) => (
              <div key={i} className="lp-feature-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="lp-feature-icon" style={{ background: 'rgba(255,255,255,0.05)' }}>{b.icon}</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: 12 }}>{b.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 12 }}>
              {[1,2,3,4,5].map(s => <Star key={s} size={20} fill="#f59e0b" color="#f59e0b" />)}
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Aprovado por +2.000 Motoristas</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 24 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="card" style={{ padding: 40 }}>
                <p style={{ fontSize: '1.125rem', fontStyle: 'italic', marginBottom: 24, lineHeight: 1.6 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 800 }}>{t.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: '100px 24px', background: 'linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.05))' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <p className="text-gradient font-bold mb-4 uppercase tracking-widest">Preço Justo</p>
          <h2 style={{ fontSize: '3rem', fontWeight: 950, marginBottom: 40 }}>Escolha seu Plano</h2>
          
          <div className="card" style={{ padding: 48, position: 'relative', border: '2px solid var(--primary)' }}>
            <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', padding: '6px 20px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 900 }}>
              MAIS POPULAR
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 8 }}>RotaPro Premium</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4, margin: '24px 0' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>R$</span>
              <span style={{ fontSize: '4rem', fontWeight: 950 }}>29,90</span>
              <span style={{ color: 'var(--text-muted)' }}>/mês</span>
            </div>
            <ul style={{ textAlign: 'left', marginBottom: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}><Check size={18} color="#10b981" /> Rotas Ilimitadas</li>
              <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}><Check size={18} color="#10b981" /> Leitor de Etiquetas (Câmera)</li>
              <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}><Check size={18} color="#10b981" /> Exportação para Waze/Maps</li>
              <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}><Check size={18} color="#10b981" /> Prioridade no Suporte</li>
            </ul>
            <button onClick={() => navigate('/')} className="lp-btn-primary w-full">ASSINAR AGORA</button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 900, marginBottom: 60 }}>Ficou com <span className="text-gradient">Dúvidas?</span></h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {faqs.map((f, i) => (
              <div key={i} className="card" style={{ padding: 24 }}>
                <h4 style={{ fontWeight: 800, marginBottom: 12, display: 'flex', gap: 12 }}><MessageSquare size={18} className="text-primary" /> {f.q}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.938rem', lineHeight: 1.6 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '120px 24px', textAlign: 'center' }}>
        <div className="lp-cta-card">
          <h2>Pronto para lucrar mais?</h2>
          <p>Junte-se a milhares de entregadores que já estão economizando tempo e dinheiro todos os dias.</p>
          <button onClick={() => navigate('/')} className="lp-btn-primary" style={{ padding: '20px 60px' }}>
            COMEÇAR TESTE GRÁTIS AGORA
          </button>
        </div>
      </section>

      <footer className="lp-footer">
        <p>&copy; 2026 RotaPro - Todos os direitos reservados.</p>
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 20 }}>
          <a href="#" style={{ color: 'var(--text-muted)' }}>Termos de Uso</a>
          <a href="#" style={{ color: 'var(--text-muted)' }}>Privacidade</a>
        </div>
      </footer>
    </div>
  );
}
