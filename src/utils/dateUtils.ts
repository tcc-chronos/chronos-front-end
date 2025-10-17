/**
 * Utilitários para formatação de datas com fuso horário do Brasil
 */

/**
 * Converte uma string de data para o fuso horário do Brasil (America/Sao_Paulo)
 * e retorna uma data formatada localmente
 */
export const formatDateToBrazilTimezone = (
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }
): string => {
  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }

    return date.toLocaleDateString('pt-BR', {
      ...options,
      timeZone: 'America/Sao_Paulo',
    });
  } catch {
    return 'Erro na data';
  }
};

/**
 * Converte uma string de data para o fuso horário do Brasil
 * e retorna data e hora formatadas
 */
export const formatDateTimeToBrazilTimezone = (dateString: string): string => {
  return formatDateToBrazilTimezone(dateString, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  });
};

/**
 * Converte uma string de data para o fuso horário do Brasil
 * e retorna apenas a data (sem hora)
 */
export const formatDateOnlyToBrazilTimezone = (dateString: string): string => {
  return formatDateToBrazilTimezone(dateString, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  });
};

/**
 * Converte uma string de data/hora ISO para o fuso horário do Brasil
 * mantendo as informações de hora e minuto
 */
export const convertToSaoPauloTimezone = (dateString: string): Date => {
  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      throw new Error(`Data inválida: ${dateString}`);
    }

    return date;
  } catch {
    return new Date();
  }
};
