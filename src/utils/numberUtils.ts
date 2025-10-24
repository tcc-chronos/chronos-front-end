export const formatNumberToLocale = (value: number, locale: string = 'pt-BR') =>
  value.toLocaleString(locale);
