import React, { useState } from 'react';
import { Package, Plus, MapPin, Camera, Trash2, CheckCircle, Navigation, Zap, AlertCircle, Clock, Sparkles, MessageCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Tesseract from 'tesseract.js';

export default function Sidebar({ deliveries, addDelivery, markAsDelivered, removeDelivery, onGenerateRoute, isPro, onLogin, user, FREE_LIMIT, clearCircuit }) {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResults, setOcrResults] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);

  const showFeedback = (message, type = 'error') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) {
      onLogin?.();
      return;
    }
    if (!address.trim()) return;

    const result = await addDelivery(address, phone);
    if (result.success) {
      setAddress('');
      setPhone('');
    } else {
      showFeedback(result.message);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'por');
      const lines = text.split('\n');
      
      // Regex para endereços brasileiros: Rua/Av/Travessa + nome + número ou CEP
      const addressPattern = /(?:rua|av|avenida|travessa|alameda|rodovia|estrada|praca|pça)\s+[a-z0-9\s]+(\d+)?|(\d{5}-?\d{3})/i;
      
      const potentialAddresses = lines
        .map(l => l.trim())
        .filter(l => l.length > 8 && addressPattern.test(l))
        .map(l => l.replace(/^[^\w]+|[^\w]+$/g, '')); // Limpa caracteres especiais nas pontas
      
      if (potentialAddresses.length > 0) {
        // Remover duplicados
        const unique = [...new Set(potentialAddresses)];
        setOcrResults(unique);
      } else {
        showFeedback('Nenhum endereço claro encontrado. Tente focar melhor na etiqueta.', 'warning');
      }
    } catch (err) {
      console.error(err);
      showFeedback('Erro ao processar imagem.');
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const confirmOcr = async (selected) => {
    for (const addr of selected) {
      await addDelivery(addr);
    }
    setOcrResults(null);
  };

  const handleProofUpload = async (e, id) => {
    const file = e.target.files[0];
    setUploadingId(id);
    const result = await markAsDelivered(id, file || null); // Passes file if selected, gracefully falls back if cancelled
    setUploadingId(null);
    if (result && !result.success) {
      showFeedback(result.message);
    }
  };

  const pendingDeliveries = deliveries.filter(d => d.status === 'pending');
  const deliveredDeliveries = deliveries.filter(d => d.status === 'delivered');

  return (
    <div className="sidebar">
      {/* Brand */}
      <div className="flex justify-between items-center">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <Package size={22} color="white" />
          </div>
          <div>
            <h1>RotaPro</h1>
          </div>
        </div>
        {isPro && (
          <span className="pro-badge" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
            color: '#1e293b',
            fontSize: '0.625rem',
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: '999px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <Zap size={10} /> PRO
          </span>
        )}
      </div>

      {deliveries.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <button 
            onClick={() => {
              if(window.confirm('Deseja limpar as entregas já concluídas?')) clearCircuit(true) 
            }}
            className="btn-ghost"
            style={{ fontSize: '0.688rem', padding: '4px 8px', color: 'var(--text-muted)' }}
          >
            Limpar Concluídas
          </button>
          <button 
            onClick={() => {
              if(window.confirm('Tem certeza que deseja zerar TODA a rota?')) clearCircuit(false) 
            }}
            className="btn-ghost"
            style={{ fontSize: '0.688rem', padding: '4px 8px', color: 'var(--danger)' }}
          >
            Zerar Tudo
          </button>
        </div>
      )}

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              background: feedback.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
              border: `1px solid ${feedback.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              fontSize: '0.813rem',
              color: feedback.type === 'error' ? '#fca5a5' : '#fcd34d',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertCircle size={14} />
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Card */}
      <div className="card">
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            placeholder="Digite o endereço ou CEP..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            id="address-input"
          />
          <input
            placeholder="WhatsApp do Cliente (Opcional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            style={{ fontSize: '0.813rem' }}
          />
          <button type="submit" className="btn-primary" id="add-delivery-btn">
            <Plus size={18} /> Adicionar Entrega
          </button>
        </form>

        <div style={{ marginTop: '12px' }}>
          <label className="ocr-dropzone block">
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} id="ocr-upload" />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>
              <Camera size={20} className={isProcessing ? "animate-pulse" : ""} style={{ color: isProcessing ? 'var(--primary)' : 'var(--text-muted)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                {isProcessing ? "Processando imagem..." : "Importar Lote via Foto (OCR)"}
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* OCR Results */}
      <AnimatePresence>
        {ocrResults && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="card-glow"
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ 
              position: 'absolute', top: 0, left: 0, width: 3, height: '100%', 
              background: 'linear-gradient(to bottom, var(--primary), var(--accent))' 
            }} />
            <h3 style={{ 
              fontSize: '0.688rem', fontWeight: 700, marginBottom: '10px', 
              display: 'flex', alignItems: 'center', gap: '6px', 
              textTransform: 'uppercase', letterSpacing: '0.05em',
              color: 'var(--primary)' 
            }}>
              <Sparkles size={12} /> {ocrResults.length} Endereços Encontrados
            </h3>
            <div style={{ maxHeight: 160, overflowY: 'auto', marginBottom: 12, paddingRight: 8 }}>
              {ocrResults.map((addr, idx) => (
                <div key={idx} style={{ 
                  fontSize: '0.688rem', padding: '8px 10px', 
                  background: 'rgba(255,255,255,0.03)', 
                  borderRadius: 'var(--radius-sm)', 
                  marginBottom: 4, 
                  border: '1px solid var(--border)' 
                }}>
                  {addr}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                className="btn-primary w-full"
                style={{ padding: '10px', fontSize: '0.75rem' }}
                onClick={() => confirmOcr(ocrResults)}
                id="ocr-confirm"
              >
                ADICIONAR TODOS
              </button>
              <button 
                className="btn-ghost"
                style={{ padding: '10px', fontSize: '0.75rem', fontWeight: 700 }}
                onClick={() => setOcrResults(null)}
              >
                FECHAR
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delivery List */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: 2 }}>
        {/* Pending Section */}
        {pendingDeliveries.length > 0 && (
          <>
            <div className="section-label">
              <Clock size={10} />
              Pendentes ({pendingDeliveries.length})
            </div>
            <div className="delivery-list">
              <AnimatePresence>
                {pendingDeliveries.map((delivery, index) => (
                  <motion.div
                    key={delivery.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ delay: index * 0.03 }}
                    className="delivery-item pending"
                  >
                    <div className="status-icon">
                      <MapPin size={14} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ 
                        fontSize: '0.813rem', fontWeight: 600, lineHeight: 1.3,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }} title={delivery.address}>
                        {delivery.address}
                      </p>
                      
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(delivery.address)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="action-link text-primary text-xs flex items-center gap-1"
                          style={{ textDecoration: 'none', fontWeight: 600, color: 'var(--primary)' }}
                        >
                          <ExternalLink size={12} /> NAVEGAR
                        </a>
                        
                        {delivery.phone && (
                          <a 
                            href={`https://wa.me/${delivery.phone.replace(/\D/g, '')}?text=${encodeURIComponent('Olá! Sou o entregador (RotaPro) e estou a caminho com o seu pedido!')}`}
                            target="_blank" rel="noopener noreferrer"
                            className="text-xs flex items-center gap-1"
                            style={{ textDecoration: 'none', fontWeight: 600, color: '#10b981' }}
                          >
                            <MessageCircle size={12} /> WHATSAPP
                          </a>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {uploadingId === delivery.id ? (
                        <div className="btn-success" style={{ opacity: 0.5 }}>
                          <span className="loading-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                        </div>
                      ) : (
                        <label className="btn-success cursor-pointer" title="Marcar como entregue (Foto)">
                          <input 
                            type="file" 
                            accept="image/*" 
                            capture="environment" 
                            className="hidden" 
                            onChange={(e) => handleProofUpload(e, delivery.id)} 
                          />
                          <Camera size={14} />
                        </label>
                      )}
                      <button 
                        onClick={() => markAsDelivered(delivery.id)} // manual without photo
                        className="btn-success"
                        style={{ padding: '8px 6px', background: 'transparent', border: '1px solid rgba(16, 185, 129, 0.2)' }}
                        title="Entregue sem foto"
                      >
                        <CheckCircle size={14} color="var(--success)" />
                      </button>
                      <button 
                        onClick={() => removeDelivery(delivery.id)}
                        className="btn-danger"
                        title="Remover"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* Delivered Section */}
        {deliveredDeliveries.length > 0 && (
          <>
            <div className="section-label" style={{ marginTop: pendingDeliveries.length > 0 ? 20 : 0 }}>
              <CheckCircle size={10} />
              Entregues ({deliveredDeliveries.length})
            </div>
            <div className="delivery-list">
              {deliveredDeliveries.map((delivery) => (
                <div key={delivery.id} className="delivery-item status-delivered">
                  <div className="status-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                    <CheckCircle size={14} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ 
                      fontSize: '0.813rem', fontWeight: 600, lineHeight: 1.3,
                      textDecoration: 'line-through', opacity: 0.7,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {delivery.address}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <p className="text-xs" style={{ color: 'var(--success)', fontSize: '0.688rem', margin: 0 }}>
                        ✓ Entregue
                      </p>
                      {delivery.proofUrl && (
                        <a 
                          href={delivery.proofUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ fontSize: '0.688rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 2 }}
                        >
                          <Camera size={10} /> Comprovante
                        </a>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => removeDelivery(delivery.id)}
                    className="btn-danger"
                    title="Remover"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {deliveries.length === 0 && (
          <div className="empty-state">
            <Package size={40} className="empty-state-icon" />
            <p>Adicione endereços para começar</p>
            <p className="text-xs text-muted" style={{ marginTop: 8 }}>
              Digite manualmente ou use o OCR via foto
            </p>
          </div>
        )}
      </div>

      {/* Generate Route Button */}
      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <button 
          onClick={onGenerateRoute} 
          className="btn-primary w-full glow-pulse"
          style={{ 
            padding: '16px 20px',
            background: deliveries.filter(d => d.status === 'pending').length >= 2 
              ? 'linear-gradient(135deg, var(--primary), var(--accent))' 
              : 'var(--bg-card)',
            boxShadow: deliveries.filter(d => d.status === 'pending').length >= 2 
              ? '0 8px 30px rgba(59, 130, 246, 0.3)' 
              : 'none',
            color: deliveries.filter(d => d.status === 'pending').length >= 2 
              ? 'white' 
              : 'var(--text-disabled)',
            cursor: deliveries.filter(d => d.status === 'pending').length >= 2 
              ? 'pointer' 
              : 'default'
          }}
          disabled={deliveries.filter(d => d.status === 'pending').length < 2}
          id="generate-route-btn"
        >
          <Navigation size={22} style={{ fill: deliveries.filter(d => d.status === 'pending').length >= 2 ? 'white' : 'var(--text-disabled)' }} />
          <div className="text-left">
            <p style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.8, lineHeight: 1, marginBottom: 3 }}>
              Mapa Pronto
            </p>
            <p style={{ fontSize: '0.938rem', fontWeight: 900 }}>INICIAR ROTA</p>
          </div>
        </button>

        {deliveries.filter(d => d.status === 'pending').length >= 2 && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <button 
              onClick={() => {
                const pending = deliveries.filter(d => d.status === 'pending');
                const waypoints = pending.slice(0, -1).map(d => encodeURIComponent(d.address)).join('|');
                const destination = encodeURIComponent(pending[pending.length - 1].address);
                window.open(`https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${destination}&waypoints=${waypoints}&travelmode=driving`, '_blank');
              }}
              className="btn-ghost w-full"
              style={{ fontSize: '0.7rem', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Map size={14} /> Maps
            </button>
            <button 
              onClick={() => {
                const destination = encodeURIComponent(deliveries.filter(d => d.status === 'pending')[0].address);
                window.open(`https://waze.com/ul?q=${destination}&navigate=yes`, '_blank');
              }}
              className="btn-ghost w-full"
              style={{ fontSize: '0.7rem', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Navigation size={14} /> Waze
            </button>
          </div>
        )}

        {!isPro && (
          <p className="text-xs text-center text-muted" style={{ marginTop: 8 }}>
            {deliveries.length}/{FREE_LIMIT} entregas no plano grátis
          </p>
        )}
      </div>
    </div>
  );
}
