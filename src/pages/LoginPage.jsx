import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login, register } from '../api/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/agendamento';

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authData, setAuthData] = useState({ email: '', password: '', name: '', phone: '' });
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuthPhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    let formatted = value;
    if (value.length > 2) formatted = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    if (value.length > 7) formatted = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    
    setAuthData({ ...authData, phone: formatted });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (isLoginMode) {
        const resp = await login({ email: authData.email, password: authData.password });
        localStorage.setItem('@naildesigner:user', JSON.stringify(resp.user));
        localStorage.setItem('@naildesigner:token', resp.token);
        toast.success('Bem-vinda de volta!');
      } else {
        const resp = await register({ 
          name: authData.name, 
          email: authData.email, 
          password: authData.password, 
          phone: authData.phone 
        });
        localStorage.setItem('@naildesigner:user', JSON.stringify(resp.user));
        localStorage.setItem('@naildesigner:token', resp.token);
        toast.success('Cadastro realizado com sucesso!');
      }
      
      // Redirect back to where the user was going
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Erro ao autenticar');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="login-page"
    >
      <div className="container login-container" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '500px' }}>
        <div className="form-wrapper glass" style={{ padding: '40px', borderRadius: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
             <Link to="/" className="btn-icon" style={{ display: 'inline-flex', marginBottom: '10px' }}>
                <ArrowLeft size={20} />
             </Link>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={isLoginMode ? 'login' : 'register'}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--color-text)' }}>
                  {isLoginMode ? 'Acesse sua conta' : 'Crie sua conta'}
                </h2>
                <p className="subtitle">
                  {isLoginMode ? 'Entre para gerenciar seus agendamentos.' : 'Cadastre-se para agendar seu horário.'}
                </p>
              </div>

              <form className="client-form" onSubmit={handleAuth}>
                {!isLoginMode && (
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '8px' }}>
                      <User size={18} /> Nome Completo
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Maria Silva"
                      value={authData.name}
                      onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                      className="text-input"
                    />
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '8px' }}>
                    <Mail size={18} /> E-mail
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="seu@email.com"
                    value={authData.email}
                    onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                    className="text-input"
                  />
                </div>

                {!isLoginMode && (
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '8px' }}>
                      <Phone size={18} /> WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(XX) 9XXXX-XXXX"
                      value={authData.phone}
                      onChange={handleAuthPhoneChange}
                      className="text-input"
                    />
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: '30px' }}>
                  <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '8px' }}>
                    <Lock size={18} /> Senha
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="**********"
                    value={authData.password}
                    onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                    className="text-input"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-gold w-full flex-center"
                  style={{ height: '55px' }}
                  disabled={authLoading}
                >
                  {authLoading ? <Loader2 className="spinner" size={20} /> : (isLoginMode ? 'Entrar' : 'Cadastrar e Entrar')}
                </button>

                <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-light)', marginTop: '20px' }}>
                  {isLoginMode ? 'Ainda não tem conta?' : 'Já possui uma conta?'}
                  {' '}
                  <span 
                    style={{ color: 'var(--color-terracotta)', fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={() => {
                      setIsLoginMode(!isLoginMode);
                      setAuthData({ ...authData, password: '' });
                    }}
                  >
                    {isLoginMode ? 'Cadastre-se' : 'Faça login'}
                  </span>
                </p>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style jsx="true">{`
        .login-page {
          min-height: 100vh;
          background-color: var(--color-off-white);
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
        .w-full { width: 100%; }
        .flex-center { display: flex; justify-content: center; align-items: center; }
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default LoginPage;
