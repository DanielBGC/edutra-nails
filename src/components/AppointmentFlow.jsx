import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Calendar as CalendarIcon, Clock, ArrowLeft, Loader2 } from 'lucide-react';
import { useServices } from '../hooks/useServices';
import { useAvailableSlots } from '../hooks/useAvailableSlots';
import { useAppointment } from '../hooks/useAppointment';

const AppointmentFlow = ({ selectedUser, onBack, onSuccess, isAdminFlow = false }) => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [appointmentNotes, setAppointmentNotes] = useState('');

  const { services, isLoading: loadingServices } = useServices();
  const { slots, isLoading: loadingSlots } = useAvailableSlots(selectedDate, selectedService?.id);
  const { submitAppointment, isLoading: submitting } = useAppointment();

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => {
    if (step === 1 && onBack) {
      onBack();
    } else {
      setStep((s) => s - 1);
    }
  };

  const formatDateBR = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleSubmitAppointment = async (e) => {
    e?.preventDefault?.();
    const payload = {
      serviceId: selectedService.id,
      clientId: selectedUser.id,
      clientName: selectedUser.name,
      clientPhone: selectedUser.phone,
      date: selectedDate,
      time: selectedSlot,
      notes: appointmentNotes,
    };
    
    const isSuccess = await submitAppointment(payload);
    if (isSuccess) {
      setStep(4);
      if (onSuccess) onSuccess();
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="appointment-flow">
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
            <div className="step-header">
              {isAdminFlow && onBack && (
                <button className="btn-icon" onClick={onBack} style={{ marginBottom: '10px' }}>
                  <ArrowLeft size={24} />
                </button>
              )}
              <h2 className="section-title">Escolha o Serviço</h2>
              <p className="subtitle">Selecione o serviço para {selectedUser.name.split(' ')[0]}.</p>
            </div>

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

        {/* STEP 3: CONFIRM DETAILS */}
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
              <h2 className="section-title">Confirmar Agendamento</h2>
            </div>
            
            <div className="summary-box">
              <p><strong>Serviço:</strong> {selectedService.name} (R$ {selectedService.price})</p>
              <p><strong>Duração:</strong> {selectedService.duration_minutes} min</p>
              <p><strong>Data/Hora:</strong> {formatDateBR(selectedDate)} às {selectedSlot}</p>
            </div>

            <div className="summary-box" style={{ background: 'var(--color-off-white)', border: '1px solid var(--color-sand)' }}>
              <h3 style={{ marginBottom: '15px', color: 'var(--color-terracotta)' }}>{isAdminFlow ? 'Dados da Cliente' : `Pronto para confirmar, ${selectedUser.name.split(' ')[0]}?`}</h3>
              <p><strong>Nome:</strong> {selectedUser.name}</p>
              <p><strong>WhatsApp:</strong> {selectedUser.phone}</p>
            </div>

            <div className="form-group" style={{ marginTop: '20px' }}>
              <label className="input-label">Observações (Opcional)</label>
              <textarea
                className="text-input"
                placeholder="Ex: Gostaria de fazer uma nail art específica, minha unha está muito curta, etc..."
                value={appointmentNotes}
                onChange={(e) => setAppointmentNotes(e.target.value)}
                rows={3}
                style={{ resize: 'none' }}
              />
            </div>

            <div className="actions" style={{ marginTop: '30px' }}>
              <button
                onClick={handleSubmitAppointment}
                className="btn btn-gold w-full flex-center"
                disabled={submitting}
              >
                {submitting ? <Loader2 className="spinner" size={20} /> : 'Finalizar e Agendar'}
              </button>
            </div>
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
              Reserva concluída com sucesso.
            </p>
            <div className="summary-box">
              <p><strong>Cliente:</strong> {selectedUser.name}</p>
              <p><strong>Data:</strong> {formatDateBR(selectedDate)}</p>
              <p><strong>Hora:</strong> {selectedSlot}</p>
              <p><strong>Serviço:</strong> {selectedService?.name}</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (isAdminFlow && onBack) {
                    onBack();
                } else {
                    setStep(1);
                    setSelectedService(null);
                    setSelectedDate('');
                    setSelectedSlot(null);
                    setAppointmentNotes('');
                }
              }}
            >
              {isAdminFlow ? 'Voltar para o Painel' : 'Fazer Novo Agendamento'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppointmentFlow;
