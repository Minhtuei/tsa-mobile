export type STATUS_DATA_TYPE = {
  label: string;
  value: string;
};
export const FILTER_DATA: STATUS_DATA_TYPE[] = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Trạng thái', value: 'STATUS' },
  { label: 'Thời gian', value: 'TIME' },
  { label: 'Thanh toán', value: 'PAYMENT' }
];

export const PAYMENT_STATUS_DATA: STATUS_DATA_TYPE[] = [
  {
    label: 'Tất cả',
    value: ''
  },
  {
    label: 'Đã thanh toán',
    value: 'true'
  },
  {
    label: 'Chưa thanh toán',
    value: 'false'
  }
];

export const ORDER_STATUS_DATA: STATUS_DATA_TYPE[] = [
  {
    label: 'Tất cả',
    value: ''
  },
  {
    label: 'Đang chờ xử lý',
    value: 'PENDING'
  },
  {
    label: 'Đã xác nhận',
    value: 'ACCEPTED'
  },
  {
    label: 'Đã từ chối',
    value: 'REJECTED'
  },
  {
    label: 'Đã giao hàng',
    value: 'DELIVERED'
  },
  {
    label: 'Đã hủy',
    value: 'CANCELED'
  },
  {
    label: 'Đang vận chuyển',
    value: 'IN_TRANSPORT'
  }
];

export const REPORT_STATUS_DATA: STATUS_DATA_TYPE[] = [
  {
    label: 'Đang chờ xử lý',
    value: 'PENDING'
  },
  {
    label: 'Đã trả lời',
    value: 'REPPLIED'
  }
];
