import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MapContainer from './components/MapContainer';
import Dashboard from './components/Dashboard';
import PrivacyPolicy from './components/PrivacyPolicy';
import SuccessPage from './components/SuccessPage';
import LoginModal from './components/LoginModal';
import LandingPage from './components/LandingPage';
import SalesPage from './components/SalesPage';
import { useDeliveries } from './hooks/useDeliveries';
import { signOut } from 'firebase/auth';
import { auth } from './services/firebase';
import { LogIn, LogOut, ShieldCheck, Zap, BarChart3, Shield, Crown, Map, ListTodo } from 'lucide-react';
import './App.css';

function MainApp() {
  const { 
    deliveries, user, isPro, loading, 
    addDelivery, markAsDelivered, removeDelivery, clearCircuit,
    FREE_LIMIT, pendingCount, deliveredCount, progressPercent 
  } = useDeliveries();
  
  const [directions, setDirections] = useState(null);
  const [routeStats, setRouteStats] = useState(null);
  const [optimizedDeliveries, setOptimizedDeliveries] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState('list'); // Mobile active tab: 'list' | 'map'
  const navigate = useNavigate();

  const getApiUrl = () => {
    const url = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    return url.endsWith('/api') ? url : `${url}/api`;
  };
  const API_URL = getApiUrl();

  // Reset optimization when deliveries change (new ones added or removed)
  React.useEffect(() => {
    setRouteStats(null);
    setOptimizedDeliveries([]);
  }, [deliveries.length]);

  const handleSubscribe = async (amount = 29.90, planName = "RotaPro Profissional") => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/create-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: user.email, 
          userId: user.uid,
          amount: amount,
          planName: planName
        })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Erro ao conectar com o servidor:", err);
    }
  };

  const generateRoute = async () => {
    if (deliveries.length < 2) return;
    const pending = deliveries.filter(d => d.status === 'pending');
    if (pending.length < 2) return;
    
    const ds = new google.maps.DirectionsService();
    ds.route({
      origin: pending[0].address,
      destination: pending[pending.length - 1].address,
      waypoints: pending.slice(1, -1).map(d => ({ location: d.address, stopover: true })),
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (res, status) => {
      if (status === 'OK') {
        setDirections(res);
        
        const route = res.routes[0];
        const waypointOrder = route.waypoint_order; // [2, 0, 1] means the 3rd waypoint is actually the 1st stop
        
        // Calcule total stats
        let totalDistance = 0;
        let totalDuration = 0;
        route.legs.forEach(leg => {
          totalDistance += leg.distance.value;
          totalDuration += leg.duration.value;
        });

        setRouteStats({
          distance: (totalDistance / 1000).toFixed(1) + ' km',
          duration: Math.round(totalDuration / 60) + ' min'
        });

        // Reorder local deliveries for display
        const middleWaypoints = pending.slice(1, -1);
        const reorderedMiddle = waypointOrder.map(index => middleWaypoints[index]);
        const finalOrder = [pending[0], ...reorderedMiddle, pending[pending.length - 1]];
        
        // Mix in already delivered items at the bottom if any
        const delivered = deliveries.filter(d => d.status === 'delivered');
        setOptimizedDeliveries([...finalOrder, ...delivered]);
      }
    });
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="sidebar-brand-icon" style={{ width: 56, height: 56 }}>
          <Zap size={28} color="white" />
        </div>
        <div className="loading-spinner" />
        <span className="loading-text">Carregando RotaPro...</span>
      </div>
    );
  }

  return (
    <div className="layout">
      {/* Login Modal */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      {/* Navbar */}
      <div className="navbar">
        {user?.email === 'admin@rotapro.app' && (
          <button 
            onClick={() => navigate('/admin')} 
            className="btn-ghost"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--border)',
              padding: '8px 14px',
              borderRadius: '999px',
              fontSize: '0.75rem'
            }}
            id="nav-admin"
          >
            <BarChart3 size={14} /> Admin
          </button>
        )}
        
        {!user ? (
          <button 
            onClick={() => setShowLogin(true)} 
            className="btn-primary"
            style={{ 
              padding: '8px 18px', 
              borderRadius: '999px',
              fontSize: '0.813rem'
            }}
            id="nav-login"
          >
            <LogIn size={16} /> Entrar
          </button>
        ) : (
          <div className="navbar-user">
            {isPro && <Crown size={14} style={{ color: '#fbbf24' }} />}
            <span>{user.email}</span>
            <button onClick={() => signOut(auth)} id="nav-logout">
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className={`sidebar-wrapper ${activeTab === 'map' ? 'mobile-hidden' : ''}`}>
        <Sidebar 
          deliveries={optimizedDeliveries.length > 0 ? optimizedDeliveries : deliveries}
          addDelivery={addDelivery}
          markAsDelivered={markAsDelivered}
          removeDelivery={removeDelivery}
          onGenerateRoute={generateRoute}
          isPro={isPro}
          onLogin={() => setShowLogin(true)}
          user={user}
          FREE_LIMIT={FREE_LIMIT}
          clearCircuit={clearCircuit}
        />
      </div>

      {/* Map Area */}
      <div className={`relative flex-1 map-wrapper ${activeTab === 'list' ? 'mobile-hidden' : ''}`}>
        {/* Progress HUD */}
        {deliveries.length > 0 && (
          <div className="progress-hud">
            <div className="progress-hud-inner">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase" style={{ color: 'var(--success)' }}>
                    Progresso
                  </span>
                  {isPro && <ShieldCheck size={13} style={{ color: 'var(--primary)' }} />}
                  {routeStats && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(59, 130, 246, 0.2)', color: 'var(--primary)' }}>
                      {routeStats.distance} • {routeStats.duration}
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                  {deliveredCount}/{deliveries.length} Entregas
                </span>
              </div>
              <div className="progress-bar-track">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Banner */}
        {!isPro && user && deliveries.length >= 7 && (
          <div className="upgrade-banner animate-slide-up">
            <div className="upgrade-banner-inner">
              <div className="upgrade-banner-text">
                <h3>Plano Grátis: {deliveries.length}/{FREE_LIMIT}</h3>
                <p>Desbloqueie rotas ilimitadas</p>
              </div>
              <button onClick={handleSubscribe} className="upgrade-banner-btn" id="upgrade-btn">
                ASSINAR PRO <Zap size={14} />
              </button>
            </div>
          </div>
        )}

        <MapContainer directions={directions} deliveries={deliveries} />

        {/* Privacy Link */}
        <button 
          onClick={() => navigate('/privacy')} 
          className="privacy-link"
          id="privacy-link"
        >
          <Shield size={10} /> Privacidade
        </button>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="bottom-nav">
        <button 
          className={`bottom-nav-item ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <ListTodo size={20} />
          <span>Entregas</span>
          {pendingCount > 0 && <span className="bottom-nav-badge">{pendingCount}</span>}
        </button>
        <button 
          className={`bottom-nav-item ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          <Map size={20} />
          <span>Mapa</span>
        </button>
      </div>
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
      <Route path="/admin" element={<Dashboard onBack={() => navigate('/')} />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/sucesso" element={<SuccessPage />} />
      <Route path="/vendas" element={<SalesPage />} />
    </Routes>
  );
}

export default App;
