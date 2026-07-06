import { format, formatDistanceToNow } from 'date-fns';
import id from 'date-fns/locale/id';

// ----------------------------------------------------------------------
export function fDateMonth(date) {
  return format(new Date(date), 'dd MMM', { locale: id });
}

export function fDate(date) {
  return format(new Date(date), 'dd MMM yyyy', { locale: id });
}

export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm', { locale: id });
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p', { locale: id });
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: id,
  });
}
