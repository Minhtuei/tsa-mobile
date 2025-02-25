import { ReportStatus } from 'app/shared/types/report';
export interface Report {
  id: string;
  orderId?: string;
  orderCode?: string;
  reportedAt?: string;
  content: string;
  proof: string;
  reply?: string;
  repliedAt?: string;
  status: ReportStatus;
  replierId?: string;
  studentId?: string;
}

export const reportStatusMap = {
  'Đang chờ xử lý': 'PENDING',
  'Đã giải quyết': 'REPLIED'
};
