export type STATUS_DATA_TYPE = {
  label: string;
  value: string;
};
export const FILTER_DATA: STATUS_DATA_TYPE[] = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Trạng thái', value: 'STATUS' },
  { label: 'Thời gian', value: 'TIME' },
  { label: 'Phương thức thanh toán', value: 'PAYMENT_METHOD' },
];

export const STATUS_DATA: STATUS_DATA_TYPE[] = [
  {
    label: 'Đang chờ xử lý',
    value: 'PENDING',
  },
  {
    label: 'Đã xác nhận',
    value: 'ACCEPTED',
  },
  {
    label: 'Đã từ chối',
    value: 'REJECTED',
  },
  {
    label: 'Đã giao hàng',
    value: 'DELIVERED',
  },
  {
    label: 'Đã hủy',
    value: 'CANCELED',
  },
  {
    label: 'Đang vận chuyển',
    value: 'IN_TRANSPORT',
  },
];
