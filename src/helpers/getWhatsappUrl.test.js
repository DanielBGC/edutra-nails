import assert from 'node:assert/strict';
import test from 'node:test';
import { WHATSAPP_NUMBER } from '../constants/index.js';
import { getWhatsappUrl } from './getWhatsappUrl.js';

test('creates the scheduling WhatsApp URL by default', () => {
  const url = new URL(getWhatsappUrl());

  assert.equal(url.hostname, 'wa.me');
  assert.equal(url.pathname, `/${WHATSAPP_NUMBER}`);
  assert.match(url.searchParams.get('text'), /disponibilidade para agendamento/);
});

test('encodes a custom WhatsApp message', () => {
  const message = 'Olá! Quero saber mais sobre os pacotes.';
  const url = new URL(getWhatsappUrl(message));

  assert.equal(url.searchParams.get('text'), message);
});
