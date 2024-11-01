type ReportStatus = 'PENDING' | 'REPLIED';
type ReportType = {
  content: string;
  id: string;
  orderId: string;
  proof: string;
  repliedAt: string | null;
  replierId: string | null;
  reply: string | null;
  reportedAt: string;
  status: ReportStatus;
  studentId: string;
};
