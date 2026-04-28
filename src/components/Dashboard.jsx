import React, { useEffect, useState } from 'react';
import { db, auth } from '../services/firebase';
import { collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { DollarSign, Users, TrendingUp, XCircle, ArrowLeft, Activity, Package } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard({ onBack }) {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const isAdmin = user?.email === 'admin@rotapro.app';

  const [stats, setStats] = useState({
    totalRevenue: 0,
    mrr: 0,
    activeUsers: 0,
    totalUsers: 0,
    churn: 0,
    totalDeliveries: 0,
  });

  const [loading, setLoading] = useState(true);

  if (!isAdmin) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', textAlign: 'center', padding: 24 }}>
        <XCircle size={64} color="var(--danger)" style={{ marginBottom: 20 }} />
        <h1 className="text-2xl font-black mb-2">Acesso Restrito</h1>
        <p className="text-muted mb-8 max-w-sm">Esta área é exclusiva para administradores do sistema RotaPro.</p>
        <button onClick={() => navigate('/')} className="btn-primary">Voltar ao Painel</button>
      </div>
    );
  }

  useEffect(() => {
    async function fetchStats() {
      try {
        // Buscar usuários
        const usersSnapshot = await getDocs(collection(db, 'users'));
        let total = 0;
        let active = 0;
        let cancelled = 0;
        let totalUsers = 0;

        usersSnapshot.forEach(doc => {
          const user = doc.data();
          totalUsers++;
          if (user.isPaid) {
            active++;
            total += 29.90;
          } else if (user.hasEverPaid) {
            cancelled++;
          }
        });

        // Buscar entregas
        const deliveriesSnapshot = await getDocs(collection(db, 'deliveries'));
        const totalDeliveries = deliveriesSnapshot.size;

        setStats({
          totalRevenue: total * 1.5,
          mrr: total,
          activeUsers: active,
          totalUsers,
          churn: cancelled,
          totalDeliveries,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const chartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        fill: true,
        label: 'Receita (R$)',
        data: [120, 190, 300, 500, 800, stats.totalRevenue],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#0f172a',
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', font: { size: 12 } }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', font: { size: 12 } }
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <span className="loading-text">Carregando métricas...</span>
      </div>
    );
  }

  const togglePro = async (userId, currentStatus) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isPaid: !currentStatus,
        updatedAt: serverTimestamp()
      });
      // Refresh local state
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, isPaid: !currentStatus } : u));
    } catch (err) {
      console.error("Erro ao alterar status:", err);
    }
  };

  const [usersList, setUsersList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      const snap = await getDocs(collection(db, 'users'));
      setUsersList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    fetchUsers();
  }, []);

  const filteredUsers = usersList.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.id.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="sidebar-brand-icon" style={{ width: 56, height: 56 }}>
          <Activity size={28} color="white" />
        </div>
        <div className="loading-spinner" />
        <span className="loading-text">Auditando sistema...</span>
      </div>
    );
  }

  const conversionRate = stats.totalUsers > 0 
    ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) 
    : '0.0';

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-main)', padding: '40px 24px', height: '100vh' }} className="animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <div>
            <h1 className="text-4xl font-black tracking-tighter">Central de Comando</h1>
            <p className="text-muted text-sm font-medium">Gestão administrativa do ecossistema RotaPro</p>
          </div>
          <button onClick={onBack} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px', borderRadius: 'var(--radius-full)', background: 'hsla(0, 0%, 100%, 0.05)', border: '1px solid var(--border)' }}>
            <ArrowLeft size={18} /> Voltar para o App
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4" style={{ gap: 20, marginBottom: 40 }}>
          <StatCard title="Faturamento" value={`R$ ${stats.totalRevenue.toFixed(2)}`} icon={<TrendingUp size={22} />} color="#10b981" />
          <StatCard title="MRR Est." value={`R$ ${stats.mrr.toFixed(2)}`} icon={<DollarSign size={22} />} color="#2563eb" />
          <StatCard title="Assinantes" value={stats.activeUsers} icon={<Users size={22} />} color="#7c3aed" subtitle={`${conversionRate}% conversão`} />
          <StatCard title="Churn" value={stats.churn} icon={<XCircle size={22} />} color="#ef4444" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 24, marginBottom: 40 }}>
          {/* Chart */}
          <div className="card md:col-span-2" style={{ padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 className="text-lg font-bold">Crescimento de Receita</h2>
              <div className="text-xs font-bold text-success">+{stats.totalRevenue > 0 ? 15 : 0}% esse mês</div>
            </div>
            <div style={{ height: 260 }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <StatCard title="Entregas Totais" value={stats.totalDeliveries.toLocaleString()} icon={<Package size={22} />} color="#f59e0b" />
            <StatCard title="Total Usuários" value={stats.totalUsers} icon={<Activity size={22} />} color="#06b6d4" />
          </div>
        </div>

        {/* User Management */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="text-xl font-black tracking-tight">Gestão de Usuários</h2>
            <input 
              placeholder="Buscar por email ou ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ maxWidth: 300, background: 'rgba(0,0,0,0.2)', height: 40 }}
            />
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '16px 32px' }}>Usuário</th>
                  <th style={{ padding: '16px 32px' }}>Status</th>
                  <th style={{ padding: '16px 32px' }}>ID do Firebase</th>
                  <th style={{ padding: '16px 32px', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border)', transition: '0.2s hover', background: 'rgba(255,255,255,0.01)' }}>
                    <td style={{ padding: '20px 32px' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{u.email}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Membro desde {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : 'Desconhecido'}</p>
                    </td>
                    <td style={{ padding: '20px 32px' }}>
                      <span style={{ 
                        padding: '4px 12px', borderRadius: '99px', fontSize: '0.688rem', fontWeight: 900,
                        background: u.isPaid ? 'var(--success-glow)' : 'rgba(255,255,255,0.05)',
                        color: u.isPaid ? 'var(--success)' : 'var(--text-muted)',
                        border: `1px solid ${u.isPaid ? 'var(--success-glow)' : 'var(--border)'}`
                      }}>
                        {u.isPaid ? 'ASSINANTE PRO' : 'USUÁRIO FREE'}
                      </span>
                    </td>
                    <td style={{ padding: '20px 32px', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-disabled)' }}>
                      {u.id}
                    </td>
                    <td style={{ padding: '20px 32px', textAlign: 'right' }}>
                      <button 
                        onClick={() => togglePro(u.id, u.isPaid)}
                        className={u.isPaid ? 'btn-ghost' : 'btn-primary'}
                        style={{ fontSize: '0.688rem', padding: '8px 16px', borderRadius: 'var(--radius-sm)' }}
                      >
                        {u.isPaid ? 'REBAIXAR PARA FREE' : 'ATIVAR PRO MANUAL'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, subtitle }) {
  return (
    <div className="stat-card">
      <div>
        <p className="stat-card-label">{title}</p>
        <p className="stat-card-value">{value}</p>
        {subtitle && (
          <p className="text-xs" style={{ color: 'var(--text-muted)', marginTop: 4 }}>{subtitle}</p>
        )}
      </div>
      <div className="stat-card-icon" style={{ color, background: `${color}10` }}>
        {icon}
      </div>
    </div>
  );
}
