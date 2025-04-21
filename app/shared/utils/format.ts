export function formatUnixTimestamp(unixTimestamp: string): Date {
  const date = new Date(Number(unixTimestamp) * 1000);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const formattedDate = new Date(
    year,
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes)
  );
  return formattedDate;
}

export function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hour}:${minute}`;
}

export function unixTimestampToDate(unixTimestamp: string): Date {
  return new Date(Number(unixTimestamp) * 1000);
}

export function formatVNDcurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
}

export function getCurentUnixTimestamp(): string {
  return String(Math.floor(Date.now() / 1000));
}

export function formatTimeslotFromTimestamp(timestamp: Date | string | number): string | null {
  const date = new Date(Number(timestamp) * 1000);
  const hour = date.getHours();

  let timeslot: string | null = null;

  if (hour >= 7 && hour < 9) timeslot = '7h-8h45';
  else if (hour >= 9 && hour < 11) timeslot = '9h-10h45';
  else if (hour >= 11 && hour < 13) timeslot = '11h-12h45';
  else if (hour >= 13 && hour < 15) timeslot = '13h-14h45';
  else if (hour >= 15 && hour < 17) timeslot = '15h-16h45';
  else if (hour >= 17 && hour < 19) timeslot = '17h-18h45';
  else if (hour >= 19 && hour < 20) timeslot = '19h-20h45';
  else if (hour >= 20 && hour < 22) timeslot = '20h-21h45';

  if (!timeslot) return null;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year} ${timeslot} `;
}
