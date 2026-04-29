import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Lock, Mail, Users, Calendar, Settings, Edit2, Check, X, LogOut, Phone, Trash2, Plus, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { login, checkIsAdmin, getUsers } from '../api/auth';
import { getServices, updateService, createService, deleteService } from '../api/services';
import { getAllAppointments, deleteAppointment, blockSlot, deleteBlock } from '../api/appointments';
import AppointmentFlow from '../components/AppointmentFlow';

const AdminPage = () => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('@naildesigner:user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [verifyingAdmin, setVerifyingAdmin] = useState(!!user);

  const [authData, setAuthData] = useState({ email: '', password: '' });
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'services'
  
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [savingService, setSavingService] = useState(false);
  const [isCreatingService, setIsCreatingService] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', price: 0, duration_minutes: 30, description: '' });

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  
  const [isBlockingSlot, setIsBlockingSlot] = useState(false);
  const [blockForm, setBlockForm] = useState({ date: '', start_time: '09:00', end_time: '18:00', reason: '' });
  const [savingBlock, setSavingBlock] = useState(false);

  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedClientForAppointment, setSelectedClientForAppointment] = useState(null);
  const [userSearchTerm, setUserSearchTerm] = useState('');



  useEffect(() => {
    const verifyToken = async () => {
      try {
        const resp = await checkIsAdmin();
        if (resp.is_admin) {
          setIsAdminVerified(true);
        } else {
          setIsAdminVerified(false);
        }
      } catch {
        setIsAdminVerified(false);
      } finally {
        setVerifyingAdmin(false);
      }
    };

    if (user) {
      verifyToken();
    } else {
      setVerifyingAdmin(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAdminVerified) {
      if (activeTab === 'services') {
        fetchServices();
      } else {
        fetchAppointments();
      }
    }
  }, [isAdminVerified, activeTab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const resp = await login({ email: authData.email, password: authData.password });
      
      setUser(resp.user);
      localStorage.setItem('@naildesigner:user', JSON.stringify(resp.user));
      localStorage.setItem('@naildesigner:token', resp.token);
      
      // Verifying admin dynamically now that token is saved
      const adminResp = await checkIsAdmin();
      if (adminResp.is_admin) {
        setIsAdminVerified(true);
        toast.success('Bem-vinda, administradora!');
      } else {
        setIsAdminVerified(false);
        toast.error('Você não tem acesso a esta página.');
      }
    } catch (error) {
      toast.error(error.message || 'Erro ao efetuar login');
      setIsAdminVerified(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdminVerified(false);
    localStorage.removeItem('@naildesigner:user');
    localStorage.removeItem('@naildesigner:token');
  };

  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const services = await getServices();
      setServices(Array.isArray(services) ? services : (services?.data || [])); 
    } catch (error) {
      console.error(error);
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    try {
      const appointments = await getAllAppointments();
      setAppointments(Array.isArray(appointments) ? appointments : (appointments?.data || []));
    } catch (error) {
      console.error(error);
      setAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erro ao carregar usuários.');
    } finally {
      setLoadingUsers(false);
    }
  };

  const startEditService = (svc) => {
    setEditingServiceId(svc.id);
    setEditForm({ ...svc });
  };

  const cancelEdit = () => {
    setEditingServiceId(null);
    setEditForm({});
  };

  const handleSaveService = async (id) => {
    setSavingService(true);
    try {
      await updateService(id, {
        name: editForm.name,
        description: editForm.description,
        price: editForm.price,
        duration_minutes: editForm.duration_minutes
      });
      toast.success('Serviço atualizado com sucesso!');
      setEditingServiceId(null);
      fetchServices();
    } catch {
      toast.error('Erro ao atualizar serviço.');
    } finally {
      setSavingService(false);
    }
  };

  const handleCreateService = async () => {
    setSavingService(true);
    try {
      await createService(createForm);
      toast.success('Serviço criado com sucesso!');
      setIsCreatingService(false);
      setCreateForm({ name: '', price: 0, duration_minutes: 30, description: '' });
      fetchServices();
    } catch {
      toast.error('Erro ao criar serviço.');
    } finally {
      setSavingService(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este serviço?')) return;
    
    try {
      await deleteService(id);
      toast.success('Serviço removido com sucesso!');
      fetchServices();
    } catch {
      toast.error('Erro ao remover serviço.');
    }
  };

  const handleDeleteItem = async (app) => {
    if (app.itemType === 'block') {
      if (!window.confirm('Tem certeza que deseja remover este bloqueio?')) return;
      try {
        await deleteBlock(app.id);
        toast.success('Bloqueio removido com sucesso!');
        fetchAppointments();
      } catch {
        toast.error('Erro ao remover bloqueio.');
      }
    } else {
      if (!window.confirm('Tem certeza que deseja cancelar e remover este agendamento?')) return;
      try {
        await deleteAppointment(app.id);
        toast.success('Agendamento cancelado com sucesso!');
        fetchAppointments();
      } catch {
        toast.error('Erro ao cancelar agendamento.');
      }
    }
  };

  const handleBlockSlot = async () => {
    setSavingBlock(true);
    try {
      await blockSlot(blockForm);
      toast.success('Horário bloqueado com sucesso!');
      setIsBlockingSlot(false);
      setBlockForm({ date: '', start_time: '09:00', end_time: '18:00', reason: '' });
      fetchAppointments();
    } catch {
      toast.error('Erro ao bloquear horário.');
    } finally {
      setSavingBlock(false);
    }
  };

  if (verifyingAdmin) {
    return (
      <div className="admin-page">
        <div className="container admin-container flex-center" style={{ height: '60vh' }}>
          <Loader2 className="spinner" size={60} color="var(--color-gold)" />
        </div>
      </div>
    );
  }

  // Auth Checks
  if (!user) {
    return (
      <div className="admin-page">
        <div className="container admin-container">
          <div className="form-wrapper glass">
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <Lock size={40} color="var(--color-terracotta)" style={{ marginBottom: '10px' }} />
              <h2 className="section-title">Acesso Restrito</h2>
              <p className="subtitle">Faça login para acessar o painel administrativo.</p>
            </div>
            <form className="client-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label className="input-label"><Mail size={18} /> E-mail</label>
                <input
                  type="email"
                  required
                  placeholder="admin@email.com"
                  value={authData.email}
                  onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                  className="text-input"
                />
              </div>
              <div className="form-group" style={{ marginBottom: '30px' }}>
                <label className="input-label"><Lock size={18} /> Senha</label>
                <input
                  type="password"
                  required
                  placeholder="**********"
                  value={authData.password}
                  onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                  className="text-input"
                />
              </div>
              <button type="submit" className="btn btn-primary w-full flex-center" disabled={authLoading}>
                {authLoading ? <Loader2 className="spinner" size={20} /> : 'Entrar no Painel'}
              </button>
            </form>
          </div>
        </div>
        {renderStyles()}
      </div>
    );
  }

  if (!isAdminVerified) {
    return (
      <div className="admin-page">
        <div className="container admin-container">
          <div className="form-wrapper glass" style={{ textAlign: 'center' }}>
            <Lock size={60} color="var(--color-terracotta)" style={{ marginBottom: '20px' }} />
            <h2 className="section-title" style={{ color: 'var(--color-terracotta)' }}>Acesso Negado</h2>
            <p className="subtitle" style={{ fontSize: '1.1rem', marginBottom: '30px' }}>
              Sua conta não possui permissões de administrador.
            </p>
            <button onClick={handleLogout} className="btn btn-gold">
              Sair desta conta
            </button>
          </div>
        </div>
        {renderStyles()}
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container admin-container wide">
        <div className="admin-header glass">
          <div>
            <h1 className="admin-title">Painel Administrativo</h1>
            <p className="subtitle">Gerencie seus agendamentos e serviços.</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> Sair
          </button>
        </div>

        <div className="admin-content glass">
          <div className="admin-tabs">
            <button 
              className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
              onClick={() => setActiveTab('appointments')}
            >
              <Calendar size={18} />
              Agendamentos
            </button>
            <button 
              className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => setActiveTab('services')}
            >
              <Settings size={18} />
              Serviços
            </button>
          </div>

          <div className="tab-content">
            <AnimatePresence mode="wait">
              {activeTab === 'appointments' && (
                <motion.div
                  key="appointments"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="tab-header">
                    <h2>Todos os Agendamentos</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        className="btn btn-gold" 
                        onClick={() => {
                          setIsCreatingAppointment(true);
                          fetchUsers();
                        }} 
                        style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                      >
                        <Plus size={16} /> Agendar
                      </button>
                      <button className="btn btn-primary" onClick={() => setIsBlockingSlot(true)} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                        <Lock size={16} /> Bloquear
                      </button>
                      <button className="btn-icon reload-btn" onClick={fetchAppointments} title="Atualizar">
                        <Loader2 size={18} className={loadingAppointments ? 'spinner' : ''} />
                      </button>
                    </div>
                  </div>

                  {isCreatingAppointment && (
                    <div className="service-admin-card editing" style={{ marginBottom: '30px' }}>
                       <div className="edit-form">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                          <h3 style={{ margin: 0 }}>Criar Novo Agendamento</h3>
                          <button onClick={() => {
                            setIsCreatingAppointment(false);
                            setSelectedClientForAppointment(null);
                          }} className="btn-cancel" style={{ padding: '5px' }}>
                            <X size={20} />
                          </button>
                        </div>

                        {!selectedClientForAppointment ? (
                          <div className="client-selection">
                            <label className="input-label">1. Selecione a Cliente</label>
                            <input 
                              type="text" 
                              className="edit-input" 
                              placeholder="Buscar cliente por nome ou email..."
                              value={userSearchTerm}
                              onChange={(e) => setUserSearchTerm(e.target.value)}
                              style={{ marginBottom: '15px' }}
                            />
                            
                            {loadingUsers ? (
                              <div className="loading-state" style={{ padding: '20px' }}><Loader2 className="spinner" size={30} /></div>
                            ) : (
                              <div className="users-list-scroll" style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--color-sand)', borderRadius: '10px' }}>
                                {users
                                  .filter(u => 
                                    u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
                                    u.email.toLowerCase().includes(userSearchTerm.toLowerCase())
                                  )
                                  .map(u => (
                                    <div 
                                      key={u.id} 
                                      className="user-select-item"
                                      onClick={() => setSelectedClientForAppointment(u)}
                                      style={{ padding: '12px 15px', borderBottom: '1px solid var(--color-sand)', cursor: 'pointer', transition: 'background 0.2s' }}
                                    >
                                      <div style={{ fontWeight: '600' }}>{u.name}</div>
                                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>{u.email} • {u.phone}</div>
                                    </div>
                                  ))
                                }
                                {users.length > 0 && users.filter(u => 
                                  u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
                                  u.email.toLowerCase().includes(userSearchTerm.toLowerCase())
                                ).length === 0 && (
                                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-light)' }}>Nenhum usuário encontrado.</div>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="appointment-flow-container">
                             <div 
                                style={{ 
                                  marginBottom: '20px', 
                                  padding: '10px 15px', 
                                  background: 'var(--color-off-white)', 
                                  borderRadius: '10px', 
                                  display: 'flex', 
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}
                              >
                                <div>
                                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>Agendando para:</span>
                                  <div style={{ fontWeight: '700' }}>{selectedClientForAppointment.name}</div>
                                </div>
                                <button 
                                  onClick={() => setSelectedClientForAppointment(null)}
                                  style={{ background: 'none', color: 'var(--color-terracotta)', fontSize: '0.85rem', textDecoration: 'underline' }}
                                >
                                  Trocar cliente
                                </button>
                             </div>

                             <AppointmentFlow 
                               selectedUser={selectedClientForAppointment}
                               isAdminFlow={true}
                               onSuccess={() => {
                                 // After success, we refresh appointments and close the form
                                 setTimeout(() => {
                                   setIsCreatingAppointment(false);
                                   setSelectedClientForAppointment(null);
                                   fetchAppointments();
                                 }, 2000);
                               }}
                               onBack={() => setSelectedClientForAppointment(null)}
                             />
                          </div>
                        )}
                       </div>
                    </div>
                  )}

                  {isBlockingSlot && (
                    <div className="service-admin-card editing" style={{ marginBottom: '20px' }}>
                      <div className="edit-form">
                        <h3 style={{ marginBottom: '10px' }}>Bloquear Horário</h3>
                        <div className="edit-row">
                          <div>
                            <label>Data</label>
                            <input 
                              type="date"
                              className="edit-input" 
                              value={blockForm.date} 
                              onChange={e => setBlockForm({...blockForm, date: e.target.value})} 
                            />
                          </div>
                          <div>
                            <label>H. Início</label>
                            <input 
                              type="time"
                              className="edit-input"
                              value={blockForm.start_time}
                              onChange={e => setBlockForm({...blockForm, start_time: e.target.value})}
                            />
                          </div>
                          <div>
                            <label>H. Fim</label>
                            <input 
                              type="time"
                              className="edit-input"
                              value={blockForm.end_time}
                              onChange={e => setBlockForm({...blockForm, end_time: e.target.value})}
                            />
                          </div>
                        </div>
                        <div style={{ marginTop: '10px' }}>
                          <label>Motivo do Bloqueio (Opcional)</label>
                          <input 
                            className="edit-input" 
                            placeholder="Ex: Almoço, Folga, Médico..."
                            value={blockForm.reason} 
                            onChange={e => setBlockForm({...blockForm, reason: e.target.value})} 
                          />
                        </div>
                        <div className="edit-actions" style={{ marginTop: '20px' }}>
                          <button disabled={savingBlock} onClick={() => setIsBlockingSlot(false)} className="btn-cancel">
                            <X size={16}/> Cancelar
                          </button>
                          <button disabled={savingBlock || !blockForm.date || !blockForm.start_time || !blockForm.end_time} onClick={handleBlockSlot} className="btn-save">
                            {savingBlock ? <Loader2 size={16} className="spinner"/> : <Lock size={16}/>} Salvar Bloqueio
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {loadingAppointments ? (
                    <div className="loading-state"><Loader2 className="spinner" size={40} /></div>
                  ) : appointments.length === 0 ? (
                    <div className="empty-state">
                      <Calendar size={40} />
                      <p>Nenhum agendamento encontrado.</p>
                    </div>
                  ) : (
                    <div className="appointments-list">
                      {Object.keys(appointments.reduce((groups, app) => {
                        const date = app.date;
                        if (!groups[date]) groups[date] = [];
                        groups[date].push(app);
                        return groups;
                      }, {})).sort().map(date => {
                        const dateApps = appointments.filter(a => a.date === date).sort((a,b) => a.time.localeCompare(b.time));
                        
                        return (
                          <div key={date} className="date-group" style={{ marginBottom: '40px' }}>
                            <div className="date-header" style={{ padding: '10px 0', borderBottom: '2px solid var(--color-sand)', marginBottom: '15px', color: 'var(--color-terracotta)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                              <Calendar size={18} style={{ marginRight: '8px' }} />
                              {new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                              {dateApps.map(app => (
                                <div key={app.id} className="appointment-card">
                                  <div className="app-main-info">
                                    <span className="app-date" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <Clock size={14} />
                                      {app.time} {app.itemType === 'block' ? ` às ${app.end_time}` : ''}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                      <span className={`status-badge ${app.status?.toLowerCase() || 'pending'}`}>
                                        {app.status === 'confirmed' ? 'Confirmado' : app.status === 'blocked' ? 'Bloqueado' : app.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
                                      </span>
                                      <button className="btn-edit btn-red" onClick={() => handleDeleteItem(app)} title="Excluir" style={{ width: '28px', height: '28px' }}>
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                  {app.itemType === 'block' ? (
                                    <div className="app-client-info" style={{ marginTop: '10px' }}>
                                      <p><strong><Lock size={14}/> {app.client_name}</strong></p>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="app-client-info">
                                        <p><strong><Users size={14}/> Cliente:</strong> {app.client_name}</p>
                                        <p><strong><Phone size={14}/> Telefone:</strong> {app.client_phone}</p>
                                      </div>
                                      <div className="app-service-info">
                                        <p><strong>Serviços:</strong> {app.services && app.services.length > 0 ? app.services.map(s => s.name).join(' + ') : 'Nenhum serviço'}</p>
                                        <p><strong>Preço Total:</strong> R$ {app.services ? app.services.reduce((sum, s) => sum + (s.price || 0), 0).toFixed(2) : '0.00'}</p>
                                        <p><strong>Duração Total:</strong> {app.services ? app.services.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) : 0} minutos</p>
                                      </div>
                                      {app.notes && (
                                        <div className="app-notes" style={{ marginTop: '12px', padding: '10px', background: '#f9f9f9', borderRadius: '8px', borderLeft: '4px solid var(--color-gold)' }}>
                                          <p style={{ margin: 0, fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--color-text-light)' }}>
                                            <strong>Obs:</strong> {app.notes}
                                          </p>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'services' && (
                <motion.div
                  key="services"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="tab-header">
                    <h2>Gerenciar Serviços</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button className="btn btn-primary" onClick={() => setIsCreatingService(true)} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                        <Plus size={16} /> Novo
                      </button>
                      <button className="btn-icon reload-btn" onClick={fetchServices} title="Atualizar">
                        <Loader2 size={18} className={loadingServices ? 'spinner' : ''} />
                      </button>
                    </div>
                  </div>

                  {isCreatingService && (
                    <div className="service-admin-card editing" style={{ marginBottom: '20px' }}>
                      <div className="edit-form">
                        <h3 style={{ marginBottom: '10px' }}>Novo Serviço</h3>
                        <input 
                          className="edit-input" 
                          value={createForm.name} 
                          onChange={e => setCreateForm({...createForm, name: e.target.value})} 
                          placeholder="Nome do serviço"
                        />
                        <div className="edit-row">
                          <div>
                            <label>Preço (R$)</label>
                            <input 
                              type="number"
                              className="edit-input" 
                              min="0"
                              step="1.00"
                              value={createForm.price} 
                              onChange={e => setCreateForm({...createForm, price: parseFloat(e.target.value)})} 
                            />
                          </div>
                          <div>
                            <label>Duração (min)</label>
                            <input 
                              type="number"
                              className="edit-input" 
                              min="0"
                              value={createForm.duration_minutes} 
                              onChange={e => setCreateForm({...createForm, duration_minutes: parseInt(e.target.value, 10)})} 
                            />
                          </div>
                        </div>
                        <textarea 
                          className="edit-input" 
                          value={createForm.description} 
                          onChange={e => setCreateForm({...createForm, description: e.target.value})}
                          placeholder="Descrição"
                          rows={3}
                        />
                        <div className="edit-actions">
                          <button disabled={savingService} onClick={() => setIsCreatingService(false)} className="btn-cancel">
                            <X size={16}/> Cancelar
                          </button>
                          <button disabled={savingService || !createForm.name} onClick={handleCreateService} className="btn-save">
                            {savingService ? <Loader2 size={16} className="spinner"/> : <Check size={16}/>} Criar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {loadingServices ? (
                    <div className="loading-state"><Loader2 className="spinner" size={40} /></div>
                  ) : services.length === 0 ? (
                    <div className="empty-state">
                      <Settings size={40} />
                      <p>Nenhum serviço encontrado.</p>
                    </div>
                  ) : (
                    <div className="services-admin-grid">
                      {services.map(svc => {
                        const isEditing = editingServiceId === svc.id;
                        
                        return (
                          <div key={svc.id} className={`service-admin-card ${isEditing ? 'editing' : ''}`}>
                            {isEditing ? (
                              <div className="edit-form">
                                <input 
                                  className="edit-input" 
                                  value={editForm.name} 
                                  onChange={e => setEditForm({...editForm, name: e.target.value})} 
                                  placeholder="Nome do serviço"
                                />
                                <div className="edit-row">
                                  <div>
                                    <label>Preço (R$)</label>
                                    <input 
                                      type="number"
                                      className="edit-input" 
                                      min="0"
                                      step="1.00"
                                      value={editForm.price} 
                                      onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})} 
                                    />
                                  </div>
                                  <div>
                                    <label>Duração (min)</label>
                                    <input 
                                      type="number"
                                      className="edit-input" 
                                      min="0"
                                      value={editForm.duration_minutes} 
                                      onChange={e => setEditForm({...editForm, duration_minutes: parseInt(e.target.value, 10)})} 
                                    />
                                  </div>
                                </div>
                                <textarea 
                                  className="edit-input" 
                                  value={editForm.description} 
                                  onChange={e => setEditForm({...editForm, description: e.target.value})}
                                  placeholder="Descrição"
                                  rows={3}
                                />
                                <div className="edit-actions">
                                  <button disabled={savingService} onClick={cancelEdit} className="btn-cancel">
                                    <X size={16}/> Cancelar
                                  </button>
                                  <button disabled={savingService} onClick={() => handleSaveService(svc.id)} className="btn-save">
                                    {savingService ? <Loader2 size={16} className="spinner"/> : <Check size={16}/>} Salvar
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="card-header">
                                  <h3>{svc.name}</h3>
                                  <div className="actions-right">
                                    <span className="price">R$ {svc.price}</span>
                                    <button className="btn-edit btn-red" onClick={() => handleDeleteService(svc.id)} title="Remover Serviço">
                                      <Trash2 size={16} />
                                    </button>
                                    <button className="btn-edit" onClick={() => startEditService(svc)} title="Editar Serviço">
                                      <Edit2 size={16} />
                                    </button>
                                  </div>
                                </div>
                                <p className="desc">{svc.description}</p>
                                <div className="duration">
                                  <Settings size={14} /> {svc.duration_minutes} min
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      {renderStyles()}
    </div>
  );
};

const renderStyles = () => (
  <style jsx="true">{`
    .admin-page {
      padding-top: 120px;
      padding-bottom: 80px;
      min-height: 100vh;
      background-color: var(--color-off-white);
      display: flex;
      justify-content: center;
    }

    .admin-container {
      width: 100%;
      max-width: 500px;
    }

    .admin-container.wide {
      max-width: 900px;
    }

    .form-wrapper {
      padding: 40px;
      border-radius: var(--border-radius);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
      background: var(--color-white);
    }

    /* Auth Inputs Styles */
    .form-group {
      margin-bottom: 20px;
    }

    .input-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      margin-bottom: 10px;
      color: var(--color-text);
    }

    .text-input {
      width: 100%;
      padding: 15px;
      border: 2px solid var(--color-sand);
      border-radius: 12px;
      font-size: 1rem;
      font-family: var(--font-sans);
      transition: border-color 0.3s;
    }

    .text-input:focus {
      border-color: var(--color-gold);
      outline: none;
    }

    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30px;
      border-radius: var(--border-radius);
      margin-bottom: 20px;
      background: var(--color-white);
      box-shadow: 0 10px 30px rgba(0,0,0,0.03);
    }

    .admin-title {
      font-size: 1.8rem;
      color: var(--color-text);
      line-height: 1.2;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: none;
      color: var(--color-terracotta);
      font-weight: 600;
      font-size: 0.95rem;
      padding: 8px 16px;
      border-radius: 20px;
      transition: background 0.2s;
    }

    .logout-btn:hover {
      background: rgba(194, 123, 107, 0.1);
    }

    .admin-content {
      background: var(--color-white);
      border-radius: var(--border-radius);
      padding: 0;
      overflow: hidden;
      box-shadow: 0 15px 35px rgba(0,0,0,0.04);
    }

    .admin-tabs {
      display: flex;
      border-bottom: 2px solid var(--color-sand);
    }

    .tab-btn {
      flex: 1;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background: none;
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--color-text-light);
      border-bottom: 3px solid transparent;
      transition: all 0.3s;
    }

    .tab-btn:hover {
      background: var(--color-off-white);
    }

    .tab-btn.active {
      color: var(--color-gold);
      border-bottom-color: var(--color-gold);
      background: rgba(197, 160, 89, 0.05);
    }

    .tab-content {
      padding: 30px;
      min-height: 400px;
    }

    .tab-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .tab-header h2 {
      font-size: 1.5rem;
    }

    .reload-btn {
      background: var(--color-sand);
      color: var(--color-text);
      padding: 8px;
      border-radius: 50%;
      display: flex;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .reload-btn:hover {
      background: var(--color-gold-light);
      color: white;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: var(--color-text-light);
      opacity: 0.7;
    }

    .empty-state svg {
      margin-bottom: 15px;
      color: var(--color-sand);
      opacity: 0.8;
    }

    .loading-state {
      display: flex;
      justify-content: center;
      padding: 60px;
      color: var(--color-gold);
    }

    /* Appointments List */
    .appointments-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .appointment-card {
      border: 1px solid var(--color-sand);
      border-radius: 15px;
      padding: 20px;
      background: var(--color-off-white);
      transition: transform 0.2s;
    }
    
    .appointment-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    }

    .app-main-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px dashed var(--color-sand);
    }

    .app-date {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--color-text);
    }

    .status-badge {
      font-size: 0.8rem;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 20px;
      text-transform: uppercase;
    }

    .status-badge.confirmed { background: #e6f4ea; color: #1e8e3e; }
    .status-badge.pending { background: #fef7e0; color: #f29900; }
    .status-badge.cancelled { background: #fce8e6; color: #d93025; }
    .status-badge.blocked { background: #e8eaed; color: #3c4043; }

    .app-client-info p, .app-service-info p {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.95rem;
      margin-bottom: 6px;
      color: var(--color-text-light);
    }

    .app-service-info {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px dashed var(--color-sand);
    }

    /* Services Grid */
    .services-admin-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 15px;
    }

    .service-admin-card {
      border: 1px solid var(--color-sand);
      border-radius: 15px;
      padding: 20px;
      transition: all 0.3s;
    }

    .service-admin-card:hover {
      border-color: var(--color-gold-light);
    }

    .service-admin-card.editing {
      border-color: var(--color-terracotta);
      background: var(--color-off-white);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }

    .actions-right {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .btn-edit {
      background: var(--color-sand);
      color: var(--color-text);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-edit:hover {
      background: var(--color-gold);
      color: white;
    }

    .btn-red {
      background: #fce8e6;
      color: #d93025;
    }

    .btn-red:hover {
      background: #d93025;
      color: white;
    }

    .service-admin-card .desc {
      color: var(--color-text-light);
      font-size: 0.9rem;
      margin-bottom: 15px;
    }

    /* Edit Form */
    .edit-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .edit-input {
      width: 100%;
      padding: 10px 15px;
      border: 1px solid var(--color-sand);
      border-radius: 8px;
      font-family: var(--font-sans);
      font-size: 0.95rem;
    }
    
    .edit-input:focus {
      border-color: var(--color-terracotta);
      outline: none;
    }

    .edit-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .edit-row label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--color-text-light);
      margin-bottom: 4px;
      display: block;
    }

    .edit-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 10px;
    }

    .btn-cancel, .btn-save {
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 6px;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel {
      background: var(--color-sand);
      color: var(--color-text);
    }
    .btn-cancel:hover { background: #e2dcd7; }

    .btn-save {
      background: var(--color-gold);
      color: white;
    }
    .btn-save:hover { background: #b38d4a; }

    .w-full { width: 100%; }
    .flex-center { justify-content: center; display: flex; align-items: center; }
    .spinner { animation: spin 1s linear infinite; }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .admin-container { padding: 0 15px; }
      .tab-btn { font-size: 0.9rem; padding: 15px; }
      .admin-header { flex-direction: column; text-align: center; gap: 15px; }
    }

    .user-select-item:hover {
      background-color: var(--color-sand);
    }

    .appointment-flow-container {
      margin-top: 10px;
    }
  `}</style>
);

export default AdminPage;
