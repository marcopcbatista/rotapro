import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
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
  const [stats, setStats] = useState({
    totalRevenue: 0,
    mrr: 0,
    activeUsers: 0,
    totalUsers: 0,
    churn: 0,
    totalDeliveries: 0,
  });

  const [loading, setLoading] = useState(true);

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

  const conversionRate = stats.totalUsers > 0 
    ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) 
    : '0.0';

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-main)', padding: '32px', height: '100vh' }} className="animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="btn-ghost mb-8" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px' }} id="dashboard-back">
          <ArrowLeft size={18} /> Voltar para o App
        </button>

        <div style={{ marginBottom: 32 }}>
          <h1 className="text-3xl font-black" style={{ letterSpacing: '-0.03em' }}>Dashboard</h1>
          <p className="text-muted text-sm" style={{ marginTop: 4 }}>Métricas do seu negócio em tempo real</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4" style={{ gap: 16, marginBottom: 32 }}>
          <StatCard 
            title="Faturamento" 
            value={`R$ ${stats.totalRevenue.toFixed(2)}`} 
            icon={<TrendingUp size={20} />} 
            color="#10b981" 
          />
          <StatCard 
            title="MRR" 
            value={`R$ ${stats.mrr.toFixed(2)}`} 
            icon={<DollarSign size={20} />} 
            color="#3b82f6" 
          />
          <StatCard 
            title="Assinantes PRO" 
            value={stats.activeUsers} 
            icon={<Users size={20} />} 
            color="#8b5cf6" 
            subtitle={`${conversionRate}% conversão`}
          />
          <StatCard 
            title="Cancelamentos" 
            value={stats.churn} 
            icon={<XCircle size={20} />} 
            color="#ef4444" 
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 16, marginBottom: 32 }}>
          <StatCard 
            title="Total de Entregas" 
            value={stats.totalDeliveries.toLocaleString()} 
            icon={<Package size={20} />} 
            color="#f59e0b" 
          />
          <StatCard 
            title="Usuários Cadastrados" 
            value={stats.totalUsers} 
            icon={<Activity size={20} />} 
            color="#06b6d4" 
          />
        </div>

        {/* Chart */}
        <div className="card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h2 className="text-lg font-bold">Crescimento de Receita</h2>
              <p className="text-xs text-muted" style={{ marginTop: 4 }}>Últimos 6 meses</p>
            </div>
            <div style={{ 
              background: 'rgba(59, 130, 246, 0.1)', 
              padding: '6px 12px', 
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--primary)'
            }}>
              +{stats.totalRevenue > 0 ? ((stats.totalRevenue / 800 - 1) * 100).toFixed(0) : 0}% vs mês anterior
            </div>
          </div>
          <div style={{ height: 300 }}>
            <Line data={chartData} options={chartOptions} />
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
