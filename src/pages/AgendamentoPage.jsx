import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Calendar as CalendarIcon, Clock, User, Phone, ArrowLeft, Loader2 } from 'lucide-react';
import { useServices } from '../hooks/useServices';
import { useAvailableSlots } from '../hooks/useAvailableSlots';
import { useAppointment } from '../hooks/useAppointment';

const AgendamentoPage = () => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [clientData, setClientData] = useState({ name: '', phone: '', notes: '' });

  const { services, isLoading: loadingServices } = useServices();
  const { slots, isLoading: loadingSlots } = useAvailableSlots(selectedDate, selectedService?.id);
  const { submitAppointment, isLoading: submitting, success } = useAppointment();

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const formatDateBR = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    let formatted = value;
    if (value.length > 2) {
      formatted = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 7) {
      formatted = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    }
    
    setClientData({ ...clientData, phone: formatted });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      serviceId: selectedService.id,
      date: selectedDate,
      time: selectedSlot,
      clientName: clientData.name,
      clientPhone: clientData.phone,
      notes: clientData.notes,
    };
    
    const isSuccess = await submitAppointment(payload);
    if (isSuccess) {
      setStep(4); // Success step
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="agendamento-page"
    >
      <div className="container agendamento-container">
        <div className="form-wrapper glass">
          <div className="progress-container">
            {[1, 2, 3].map((i) => (
              <React.Fragment key={i}>
                <div className={`step-indicator ${step >= i ? 'active' : ''} ${step > i ? 'completed' : ''}`}>
                  {step > i ? <CheckCircle size={16} /> : i}
                </div>
                {i < 3 && <div className={`step-line ${step > i ? 'active' : ''}`} />}
              </React.Fragment>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: SELECT SERVICE */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="step-content"
              >
                <h2 className="section-title">Escolha o Serviço</h2>
                <p className="subtitle">Selecione o serviço desejado para o seu agendamento.</p>

                {loadingServices ? (
                  <div className="loading-state"><Loader2 className="spinner" size={40} /></div>
                ) : (
                  <div className="services-grid">
                    {services.map((svc) => (
                      <div
                        key={svc.id}
                        className={`service-card ${selectedService?.id === svc.id ? 'selected' : ''}`}
                        onClick={() => setSelectedService(svc)}
                      >
                        <div className="card-header">
                          <h3>{svc.name}</h3>
                          <span className="price">R$ {svc.price}</span>
                        </div>
                        <p>{svc.description}</p>
                        <div className="duration">
                          <Clock size={16} /> {svc.duration_minutes} min
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="actions">
                  <button
                    className="btn btn-primary"
                    disabled={!selectedService}
                    onClick={handleNext}
                  >
                    Continuar
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: SELECT DATE & TIME */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="step-content"
              >
                <div className="header-with-back">
                  <button className="btn-icon" onClick={handleBack}><ArrowLeft size={24} /></button>
                  <h2 className="section-title">Data e Horário</h2>
                </div>
                <div className="service-info">
                  <p className="subtitle">Serviço: <strong>{selectedService.name}</strong></p>
                  <p className="subtitle">Duração: <strong>{selectedService.duration_minutes} min</strong></p>
                </div>

                <div className="date-picker-container">
                  <label className="input-label">
                    <CalendarIcon size={18} />
                    Selecione a data
                  </label>
                  <input
                    type="date"
                    min={today}
                    className="date-input"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedSlot(null);
                    }}
                  />
                </div>

                {selectedDate && (
                  <div className="slots-container">
                    <label className="input-label">Horários Disponíveis</label>
                    {loadingSlots ? (
                      <div className="loading-state"><Loader2 className="spinner" size={30} /></div>
                    ) : slots.length > 0 ? (
                      <div className="slots-grid">
                        {slots.map((slot) => (
                          <div
                            key={slot}
                            className={`slot-card ${selectedSlot === slot ? 'selected' : ''}`}
                            onClick={() => setSelectedSlot(slot)}
                          >
                            {slot}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-slots">Nenhum horário disponível nesta data. Tente outro dia.</p>
                    )}
                  </div>
                )}

                <div className="actions">
                  <button
                    className="btn btn-primary"
                    disabled={!selectedDate || !selectedSlot}
                    onClick={handleNext}
                  >
                    Continuar
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: CLIENT DETAILS */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="step-content"
              >
                <div className="header-with-back">
                  <button className="btn-icon" onClick={handleBack}><ArrowLeft size={24} /></button>
                  <h2 className="section-title">Seus Dados</h2>
                </div>
                
                <div className="summary-box">
                  <p><strong>Serviço:</strong> {selectedService.name} (R$ {selectedService.price})</p>
                  <p><strong>Data/Hora:</strong> {formatDateBR(selectedDate)} às {selectedSlot}</p>
                </div>

                <form className="client-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="input-label"><User size={18} /> Nome Completo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Maria Silva"
                      value={clientData.name}
                      onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                      className="text-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="input-label"><Phone size={18} /> WhatsApp</label>
                    <input
                      type="tel"
                      required
                      placeholder="(XX) 9XXXX-XXXX"
                      value={clientData.phone}
                      onChange={handlePhoneChange}
                      className="text-input"
                    />
                  </div>
                  <div className="actions">
                    <button
                      type="submit"
                      className="btn btn-gold w-full flex-center"
                      disabled={submitting || !clientData.name || !clientData.phone}
                    >
                      {submitting ? <Loader2 className="spinner" size={20} /> : 'Confirmar Agendamento'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="step-content success-content"
              >
                <div className="success-icon">
                  <CheckCircle size={80} color="var(--color-gold)" />
                </div>
                <h2 className="section-title">Agendamento Confirmado!</h2>
                <p className="subtitle">
                  Sua reserva foi concluída com sucesso. Você receberá uma confirmação no seu WhatsApp.
                </p>
                <div className="summary-box">
                  <p><strong>Data:</strong> {formatDateBR(selectedDate)}</p>
                  <p><strong>Hora:</strong> {selectedSlot}</p>
                  <p><strong>Serviço:</strong> {selectedService?.name}</p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setStep(1);
                    setSelectedService(null);
                    setSelectedDate('');
                    setSelectedSlot(null);
                    setClientData({ name: '', phone: '', notes: '' });
                  }}
                >
                  Fazer Novo Agendamento
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx="true">{`
        .agendamento-page {
          padding-top: 120px;
          padding-bottom: 80px;
          min-height: 100vh;
          background-color: var(--color-off-white);
          display: flex;
          justify-content: center;
        }

        .agendamento-container {
          width: 100%;
          max-width: 700px;
        }

        .form-wrapper {
          padding: 40px;
          border-radius: var(--border-radius);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
          background: var(--color-white);
        }

        .progress-container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 40px;
        }

        .step-indicator {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--color-sand);
          color: var(--color-text-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          transition: all 0.3s;
        }

        .step-indicator.active {
          background: var(--color-gold);
          color: white;
          box-shadow: 0 4px 10px rgba(197, 160, 89, 0.3);
        }
        
        .step-indicator.completed {
          background: var(--color-terracotta);
          color: white;
        }

        .step-line {
          height: 3px;
          width: 60px;
          background: var(--color-sand);
          margin: 0 10px;
          transition: all 0.3s;
        }

        .step-line.active {
          background: var(--color-terracotta);
        }

        .section-title {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: var(--color-text);
        }
        
        .section-title::after {
          display: none;
        }

        .subtitle {
          color: var(--color-text-light);
          margin-bottom: 8px;
        }

        .service-info {
          margin-bottom: 30px;
        }

        .services-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
          margin-bottom: 30px;
        }

        .service-card {
          border: 2px solid var(--color-sand);
          border-radius: 15px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .service-card:hover {
          border-color: var(--color-gold-light);
          background-color: var(--color-off-white);
        }

        .service-card.selected {
          border-color: var(--color-gold);
          background-color: rgba(197, 160, 89, 0.05);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .card-header h3 {
          font-size: 1.2rem;
          margin: 0;
          font-family: var(--font-sans);
        }

        .price {
          font-weight: 700;
          color: var(--color-terracotta);
        }

        .service-card p {
          font-size: 0.9rem;
          color: var(--color-text-light);
          margin-bottom: 15px;
        }

        .duration {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.85rem;
          color: var(--color-text-light);
          background: var(--color-sand);
          padding: 4px 10px;
          border-radius: 20px;
          width: fit-content;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }

        .header-with-back {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 0.5rem;
        }

        .btn-icon {
          background: none;
          border: none;
          color: var(--color-text);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          border-radius: 50%;
          transition: background 0.3s;
        }

        .btn-icon:hover {
          background: var(--color-sand);
        }

        .input-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          margin-bottom: 10px;
          color: var(--color-text);
        }

        .date-input, .text-input {
          width: 100%;
          padding: 15px;
          border: 2px solid var(--color-sand);
          border-radius: 12px;
          font-size: 1rem;
          font-family: var(--font-sans);
          transition: border-color 0.3s;
        }

        .date-input:focus, .text-input:focus {
          border-color: var(--color-gold);
          outline: none;
        }

        .date-picker-container {
          margin-bottom: 30px;
        }

        .slots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 10px;
        }

        .slot-card {
          border: 2px solid var(--color-sand);
          border-radius: 10px;
          padding: 12px 0;
          text-align: center;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .slot-card:hover {
          border-color: var(--color-gold-light);
        }

        .slot-card.selected {
          background: var(--color-terracotta);
          border-color: var(--color-terracotta);
          color: white;
        }

        .no-slots {
          color: var(--color-terracotta);
          font-weight: 500;
          font-size: 0.95rem;
        }

        .summary-box {
          background: var(--color-sand);
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .summary-box p {
          margin-bottom: 8px;
        }
        .summary-box p:last-child {
          margin-bottom: 0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .w-full {
          width: 100%;
        }

        .flex-center {
          justify-content: center;
        }

        .success-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .success-icon {
          margin-bottom: 20px;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        .loading-state {
          display: flex;
          justify-content: center;
          padding: 40px;
          color: var(--color-gold);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 600px) {
          .form-wrapper {
            padding: 25px;
          }
          .services-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default AgendamentoPage;
