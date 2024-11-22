export type ReportStatus = 'PENDING' | 'REPLIED';
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

type CreateReport = Pick<
  ReportType,
  'content' | 'studentId' | 'proof' | 'reply' | 'repliedAt' | 'reportedAt'
>;

type UploadedImage = {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  asset_folder: string;
  display_name: string;
  original_filename: string;
  api_key: string;
};
