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
