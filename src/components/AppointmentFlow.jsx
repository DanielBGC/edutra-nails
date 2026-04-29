import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Calendar as CalendarIcon, Clock, ArrowLeft, Loader2 } from 'lucide-react';
import { useServices } from '../hooks/useServices';
import { useAvailableSlots } from '../hooks/useAvailableSlots';
import { useAppointment } from '../hooks/useAppointment';
import { formatDuration } from '../helpers/formatDuration';
import { formatPrice } from '../helpers/formatPrice';

const AppointmentFlow = ({ selectedUser, onBack, onSuccess, isAdminFlow = false }) => {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [tempDate, setTempDate] = useState(''); // Local state for input to allow debouncing
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [dateError, setDateError] = useState('');
  
  const containerRef = useRef(null);
  const actionsRef = useRef(null);

  const { services, isLoading: loadingServices } = useServices();
  const selectedServiceIds = selectedServices.map(s => s.id);
  const { slots, isLoading: loadingSlots } = useAvailableSlots(selectedDate, selectedServiceIds);
  const { submitAppointment, isLoading: submitting } = useAppointment();

  const totalDuration = selectedServices.reduce((acc, s) => acc + s.duration_minutes, 0);
  const totalPrice = selectedServices.reduce((acc, s) => acc + s.price, 0);

  // Scroll to top when step changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [step]);

  // Scroll to action button when services are selected
  useEffect(() => {
    if (selectedServices.length > 0 && step === 1 && actionsRef.current) {
      setTimeout(() => {
        actionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 500);
    }
  }, [selectedServices.length, step]);

  const toggleService = (svc) => {
    setSelectedServices(prev => {
      const isSelected = prev.find(s => s.id === svc.id);
      if (isSelected) {
        return prev.filter(s => s.id !== svc.id);
      } else {
        return [...prev, svc];
      }
    });
  };

  const validateDateInput = (inputDate) => {
    if (inputDate.length === 0) {
      return { nextDate: '', nextError: '' };
    }

    const localToday = new Date();
    const todayStr = localToday.getFullYear() + '-' + 
                     String(localToday.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(localToday.getDate()).padStart(2, '0');

    const year = parseInt(inputDate.split('-')[0], 10);
    const currentYear = localToday.getFullYear();
    const isFullFormat = inputDate.length === 10;

    if (isFullFormat) {
      const isValidYear = year >= currentYear && year < currentYear + 10;
      const isPast = inputDate < todayStr;

      if (!isValidYear) {
        return { nextDate: '', nextError: 'Por favor, insira um ano válido.' };
      }
      if (isPast) {
        return { nextDate: '', nextError: 'Não é possível agendar em datas passadas.' };
      }
      return { nextDate: inputDate, nextError: '' };
    }

    return { nextDate: '', nextError: '' };
  };

  const handleDateChange = (nextTempDate) => {
    setTempDate(nextTempDate);
    const { nextDate, nextError } = validateDateInput(nextTempDate);
    const didDateChange = nextDate !== selectedDate;
    setDateError(nextError);
    setSelectedDate(nextDate);
    if (!nextDate || didDateChange) {
      setSelectedSlot(null);
    }
  };

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
      serviceIds: selectedServices.map(s => s.id),
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
    <div className="appointment-flow" ref={containerRef}>
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
                {services.map((svc) => {
                  const isSelected = selectedServices.find(s => s.id === svc.id);
                  return (
                    <div
                      key={svc.id}
                      className={`service-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleService(svc)}
                    >
                      <div className="card-header">
                        <h3>{svc.name}</h3>
                        <span className="price">{formatPrice(svc.price)}</span>
                      </div>
                      <p>{svc.description}</p>
                      <div className="duration">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Clock size={14} /> 
                          {svc.duration_minutes} MIN
                        </div>
                        {isSelected && <CheckCircle className="selected-icon" size={18} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="actions selection-summary-actions" ref={actionsRef}>
              {selectedServices.length > 0 && (
                <div className="selection-summary">
                  <span>{selectedServices.length} {selectedServices.length === 1 ? 'serviço' : 'serviços'} selecionados</span>
                  <p><strong>Total: {formatPrice(totalPrice)}</strong> • {formatDuration(totalDuration)}</p>
                </div>
              )}
              <button
                className="btn btn-primary"
                disabled={selectedServices.length === 0}
                onClick={handleNext}
              >
                Continuar para Data e Hora
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
            <div className="service-info multi-service">
              <div className="selected-list">
                {selectedServices.map(s => (
                  <span key={s.id} className="service-badge">{s.name}</span>
                ))}
              </div>
              <p className="subtitle">Duração Total: <strong>{formatDuration(totalDuration)}</strong></p>
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
                value={tempDate}
                onChange={(e) => handleDateChange(e.target.value)}
              />
              {dateError && (
                <p style={{ color: 'var(--color-terracotta)', fontSize: '0.85rem', marginTop: '8px', fontWeight: '500' }}>
                  {dateError}
                </p>
              )}
            </div>

            {selectedDate && (
              <div className="slots-container" ref={actionsRef}>
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
              <p><strong>Serviços:</strong> {selectedServices.map(s => s.name).join(' + ')}</p>
              <p><strong>Valor Total:</strong> {formatPrice(totalPrice)}</p>
              <p><strong>Duração Total:</strong> {formatDuration(totalDuration)}</p>
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

            <div className="actions" style={{ marginTop: '30px' }} ref={actionsRef}>
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
              <p><strong>Serviços:</strong> {selectedServices.map(s => s.name).join(' + ')}</p>
              <p><strong>Total:</strong> {formatPrice(totalPrice)}</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (isAdminFlow && onBack) {
                    onBack();
                } else {
                    setStep(1);
                    setSelectedServices([]);
                    setSelectedDate('');
                    setTempDate('');
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
