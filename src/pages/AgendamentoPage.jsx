import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppointmentFlow from '../components/AppointmentFlow';

const AgendamentoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('@naildesigner:user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: location } });
    }
  }, [user, navigate, location]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('@naildesigner:user');
    localStorage.removeItem('@naildesigner:token');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="agendamento-page"
    >
      <div className="container agendamento-container">
        <div className="form-wrapper glass">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', fontSize: '0.85rem' }}>
            <div style={{ textAlign: 'right' }}>
              <p>Cliente: <strong>{user.name.split(' ')[0]}</strong></p>
              <button 
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', color: 'var(--color-terracotta)', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
              >
                Sair da conta
              </button>
            </div>
          </div>

          <AppointmentFlow 
            selectedUser={user} 
            onSuccess={() => {
              // Any specific success logic for client can go here
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default AgendamentoPage;
