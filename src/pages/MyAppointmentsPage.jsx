import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, LogOut, Loader2, Calendar, Clock, Trash2, CheckCircle, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { getMyAppointments, deleteAppointment } from '../api/appointments';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const MyAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('@naildesigner:user') || 'null');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const resp = await getMyAppointments();
      setAppointments(resp.data || []);
    } catch (error) {
      toast.error('Erro ao carregar seus agendamentos.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('@naildesigner:user');
    localStorage.removeItem('@naildesigner:token');
    navigate('/login');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja cancelar este agendamento?')) return;
    try {
      await deleteAppointment(id);
      toast.success('Agendamento cancelado com sucesso.');
      fetchAppointments();
    } catch (error) {
      toast.error('Erro ao cancelar agendamento.');
    }
  };

  const grouped = appointments.reduce((groups, app) => {
    const date = app.date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(app);
    return groups;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="my-appointments-page"
    >
      <div className="container agendamento-container" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '800px' }}>
        <div className="admin-header glass" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 30px', borderRadius: '15px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/agendamento" className="btn-icon" style={{ padding: '5px' }}>
                <ArrowLeft size={20} />
              </Link>
              <h1 style={{ fontSize: '1.5rem', color: 'var(--color-text)' }}>Meus Agendamentos</h1>
            </div>
            <p className="subtitle" style={{ marginLeft: '35px' }}>Olá, {user?.name.split(' ')[0]}! Veja sua agenda abaixo.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button className="logout-btn" onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--color-terracotta)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <LogOut size={16} /> Sair
            </button>
          </div>
        </div>

        <div className="glass" style={{ padding: '30px', borderRadius: '15px', minHeight: '400px' }}>
          {loading ? (
            <div className="loading-state" style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
              <Loader2 className="spinner" size={40} color="var(--color-gold)" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="empty-state" style={{ textAlign: 'center', padding: '50px' }}>
              <Calendar size={50} style={{ opacity: 0.2, marginBottom: '20px' }} />
              <h3>Nenhum agendamento encontrado</h3>
              <p className="subtitle">Você ainda não tem horários marcados.</p>
              <Link to="/agendamento" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
                Agendar Agora
              </Link>
            </div>
          ) : (
            <div className="appointments-list">
              {sortedDates.map(date => (
                <div key={date} className="date-group" style={{ marginBottom: '30px' }}>
                  <div className="date-header" style={{ padding: '10px 0', borderBottom: '1px solid var(--color-sand)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-terracotta)', fontWeight: 'bold' }}>
                    <Calendar size={18} />
                    {new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                    {grouped[date].sort((a,b) => a.time.localeCompare(b.time)).map(app => (
                      <div key={app.id} className="appointment-card glass" style={{ border: '1px solid var(--color-sand)', padding: '20px', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
                              <Clock size={18} color="var(--color-gold)" />
                              {app.time}
                            </div>
                            <p style={{ margin: '5px 0' }}><strong>Serviço:</strong> {app.service?.name}</p>
                            <p style={{ margin: '5px 0', fontSize: '0.9rem', color: 'var(--color-text-light)' }}>{app.service?.duration_minutes} min • R$ {app.service?.price}</p>
                            
                            {app.notes && (
                              <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(197, 160, 89, 0.05)', borderRadius: '8px', fontSize: '0.85rem', borderLeft: '3px solid var(--color-gold)' }}>
                                <strong>Minha observação:</strong> {app.notes}
                              </div>
                            )}
                          </div>
                          
                          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                            <span className={`status-badge ${app.status?.toLowerCase() || 'pending'}`}>
                              {app.status === 'confirmed' ? 'Confirmado' : app.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
                            </span>
                            <button 
                              onClick={() => handleDelete(app.id)}
                              className="btn-edit btn-red"
                              title="Cancelar Agendamento"
                              style={{ width: '32px', height: '32px' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx="true">{`
        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .status-badge.confirmed { background: #e6f4ea; color: #1e8e3e; }
        .status-badge.pending { background: #fef7e0; color: #f29900; }
        .status-badge.cancelled { background: #fce8e6; color: #d93025; }
        
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .btn-red:hover {
          background-color: var(--color-terracotta) !important;
          color: white !important;
        }
        .logout-btn {
          transition: opacity 0.3s ease;
        }
        .logout-btn:hover {
          opacity: 0.7;
        }
      `}</style>
    </motion.div>
  );
};

export default MyAppointmentsPage;
