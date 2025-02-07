// services/calendarService.ts
import moment from 'moment';

interface CalendarEvent {
  prevDate: string;
  nextDate: string;
  summary: string;
  description?: string;
}

export const subscribe = (eventData: CalendarEvent) => {
  const { prevDate, nextDate, summary, description } = eventData;
  
  const baseUrl = 'https://calendar.google.com/calendar/render';
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: summary,
    dates: `${nextDate.replace(/-/g, '')}/${nextDate.replace(/-/g, '')}`,
    details: description || '',
    recur: `RRULE:FREQ=DAILY;INTERVAL=${moment(nextDate).diff(moment(prevDate), 'days')}`
  });

  const calendarUrl = `${baseUrl}?${params.toString()}`;
  window.open(calendarUrl, '_blank');
};