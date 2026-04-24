import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, Shield, Clock, Map, Camera, MessageCircle, 
  CheckCircle2, ArrowRight, Gauge, Fuel, Star 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Camera className="text-blue-500" />,
      title: "Scanner de Endereço",
      desc: "Tire uma foto da pilha de pacotes e deixe nossa IA ler todos os endereços instantaneamente."
    },
    {
      icon: <Gauge className="text-purple-500" />,
      title: "Roteirização Inteligente",
      desc: "Organizamos 50+ paradas na ordem ideal para você não dar voltas desnecessárias."
    },
    {
      icon: <Fuel className="text-green-500" />,
      title: "Economia de Combustível",
      desc: "Reduza seus custos em até 30% rodando o caminho mais curto todos os dias."
    },
    {
      icon: <MessageCircle className="text-emerald-500" />,
      title: "WhatsApp Automático",
      desc: "Avise o cliente que você está chegando com apenas um toque no aplicativo."
    }
  ];

  return (
    <div className="lp-container">
      {/* Header/Nav */}
      <nav className="lp-nav">
        <div className="flex items-center gap-2">
          <div className="sidebar-brand-icon" style={{ width: 32, height: 32 }}>
            <Zap size={18} color="white" />
          </div>
          <span className="font-black text-xl tracking-tighter">RotaPro</span>
        </div>
        <button onClick={() => navigate('/')} className="lp-nav-btn">
          ENTRAR NO APP <ArrowRight size={16} />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="lp-hero">
        <div className="lp-hero-content">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lp-badge"
          >
            🚀 O App #1 para Entregadores de E-commerce
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Faça 5 horas de entrega <br />
            em apenas <span className="text-gradient">3 horas.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            O RotaPro organiza centenas de endereços de plataformas como Mercado Livre, 
            Jadlog e Loggi na ordem perfeita. Economize combustível e volte para casa mais cedo.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 mt-8"
          >
            <button onClick={() => navigate('/')} className="lp-btn-primary">
              COMEÇAR AGORA GRATUITO
            </button>
            <div className="lp-trust-badge">
              <div className="flex text-yellow-500">
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
              </div>
              <span>+1,000 Motoristas</span>
            </div>
          </motion.div>
        </div>
        
        <div className="lp-hero-image">
          <img src="/rotapro_hero_delivery_1777056328160.png" alt="RotaPro App" />
          <div className="lp-floating-card">
            <CheckCircle2 color="#10b981" size={20} />
            <div>
              <p className="font-bold text-sm">Rota Otimizada</p>
              <p className="text-xs opacity-70">Economia de R$ 45,00 hoje</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="lp-features">
        <h2>Tudo o que você precisa para <br />ser um <span>entregador de elite</span></h2>
        <div className="lp-grid">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="lp-feature-card"
            >
              <div className="lp-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="lp-cta-bottom">
        <div className="lp-cta-card">
          <h2>Pronto para profissionalizar sua logística?</h2>
          <p>Junte-se a milhares de motoristas que já estão ganhando mais tempo e dinheiro.</p>
          <button onClick={() => navigate('/')} className="lp-btn-primary scale-125">
            CRIAR MINHA CONTA GRÁTIS
          </button>
        </div>
      </section>

      <footer className="lp-footer">
        <p>© 2026 RotaPro — Inteligência Logística para Entregadores.</p>
      </footer>
    </div>
  );
}
