import { WHATSAPP_NUMBER } from '../constants/index.js';

const DEFAULT_MESSAGE =
  'Olá, vi o seu portfólio e adorei o seu trabalho. Gostaria de saber sua disponibilidade para agendamento.';

export const getWhatsappUrl = (message = DEFAULT_MESSAGE) => {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};
