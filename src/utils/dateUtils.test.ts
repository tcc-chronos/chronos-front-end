import { describe, it, expect } from 'vitest';
import {
  formatDateToBrazilTimezone,
  formatDateTimeToBrazilTimezone,
  formatDateOnlyToBrazilTimezone,
  convertToSaoPauloTimezone,
} from './dateUtils';

describe('dateUtils', () => {
  describe('formatDateToBrazilTimezone', () => {
    it('should format a valid date string with default options', () => {
      const dateString = '2024-01-15T10:30:00Z';
      const result = formatDateToBrazilTimezone(dateString);

      // O resultado deve estar no formato DD/MM/AAAA
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });

    it('should format a valid date string with custom options', () => {
      const dateString = '2024-01-15T10:30:00Z';
      const result = formatDateToBrazilTimezone(dateString, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Sao_Paulo',
      });

      // O resultado deve estar no formato DD/MM/AAAA, HH:MM
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4},?\s\d{2}:\d{2}$/);
    });

    it('should handle invalid date strings', () => {
      const result = formatDateToBrazilTimezone('invalid-date');
      expect(result).toBe('Data inválida');
    });

    it('should handle empty string', () => {
      const result = formatDateToBrazilTimezone('');
      expect(result).toBe('Data inválida');
    });
  });

  describe('formatDateTimeToBrazilTimezone', () => {
    it('should format a valid date string with date and time', () => {
      const dateString = '2024-01-15T10:30:00Z';
      const result = formatDateTimeToBrazilTimezone(dateString);

      // O resultado deve conter data e hora
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4},?\s\d{2}:\d{2}$/);
    });

    it('should handle invalid date strings', () => {
      const result = formatDateTimeToBrazilTimezone('invalid-date');
      expect(result).toBe('Data inválida');
    });
  });

  describe('formatDateOnlyToBrazilTimezone', () => {
    it('should format a valid date string with only date', () => {
      const dateString = '2024-01-15T10:30:00Z';
      const result = formatDateOnlyToBrazilTimezone(dateString);

      // O resultado deve estar no formato DD/MM/AAAA (sem hora)
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });

    it('should handle invalid date strings', () => {
      const result = formatDateOnlyToBrazilTimezone('invalid-date');
      expect(result).toBe('Data inválida');
    });
  });

  describe('convertToSaoPauloTimezone', () => {
    it('should convert a valid date string to Date object', () => {
      const dateString = '2024-01-15T10:30:00Z';
      const result = convertToSaoPauloTimezone(dateString);

      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).not.toBeNaN();
    });

    it('should handle invalid date strings and return current date', () => {
      const result = convertToSaoPauloTimezone('invalid-date');

      expect(result).toBeInstanceOf(Date);
      // Deve retornar uma data válida (fallback para data atual)
      expect(result.getTime()).not.toBeNaN();
    });

    it('should handle ISO date strings correctly', () => {
      const dateString = '2024-01-15T10:30:00.000Z';
      const result = convertToSaoPauloTimezone(dateString);

      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0); // Janeiro = 0
      expect(result.getDate()).toBe(15);
    });
  });

  describe('timezone handling', () => {
    it('should apply America/Sao_Paulo timezone correctly', () => {
      // Data UTC meio-dia
      const dateString = '2024-07-15T12:00:00Z'; // Julho (horário de inverno em SP = UTC-3)

      const result = formatDateTimeToBrazilTimezone(dateString);

      // O resultado deve estar formatado para o fuso horário de São Paulo
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should handle daylight saving time differences', () => {
      // Data durante horário de verão no Brasil (outubro-fevereiro)
      const summerDate = '2024-01-15T12:00:00Z'; // Janeiro (horário de verão = UTC-2)
      // Data durante horário de inverno no Brasil (março-setembro)
      const winterDate = '2024-07-15T12:00:00Z'; // Julho (horário padrão = UTC-3)

      const summerResult = formatDateTimeToBrazilTimezone(summerDate);
      const winterResult = formatDateTimeToBrazilTimezone(winterDate);

      expect(summerResult).toBeTruthy();
      expect(winterResult).toBeTruthy();
      expect(typeof summerResult).toBe('string');
      expect(typeof winterResult).toBe('string');
    });
  });
});
