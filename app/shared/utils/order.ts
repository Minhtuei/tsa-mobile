import { DeliveryStatus } from 'app/shared/types/delivery';
import { OrderStatus } from 'app/shared/types/order';
import { ReportStatus } from 'app/shared/types/report';

export const shortenUUID = (uuid: string, type: 'ORDER' | 'DELIVERY') => {
  return `#${type === 'ORDER' ? 'TSA' : 'DELI'}${uuid.slice(uuid.length - 6, uuid.length).toUpperCase()}`;
};
export const getStatusRender = (status: OrderStatus | ReportStatus | DeliveryStatus) => {
  switch (status) {
    case 'PENDING': {
      return {
        color: 'rgba(148, 163, 184, 1)',
        label: 'Đang chờ'
      };
    }
    case 'REPLIED':
    case 'ACCEPTED': {
      return {
        color: 'rgba(52, 168, 83, 1)',
        label: 'Chấp nhận'
      };
    }
    case 'REJECTED': {
      return {
        color: 'rgba(251,2,9,1)',
        label: 'Từ chối'
      };
    }
    case 'IN_TRANSPORT': {
      return {
        color: 'rgba(66, 133, 244, 1)',
        label: 'Đang vận chuyển'
      };
    }
    case 'DELIVERED': {
      return {
        color: 'rgb(0, 109, 50)',
        label: 'Đã giao'
      };
    }
    case 'CANCELED': {
      return {
        color: 'rgba(251,2,9,1)',
        label: 'Đã hủy'
      };
    }
    case 'FINISHED': {
      return {
        color: 'orange',
        label: 'Hoàn thành'
      };
    }
    default: {
      return {
        color: 'rgba(148, 163, 184, 1)',
        label: 'Đang chờ'
      };
    }
  }
};
