export interface CompressUploadPayload {
  type: 'path' | 'buffer';
  data: string | Buffer;
}

export interface CompressUploadResult {
  success: boolean;
  filePath?: string;
  previewData?: string;
  error?: string;
}

export interface UploadConfig {
  apiUrl: string;
  userId: string;
  filename: string;
  contentType: string;
}

export interface ApiResponse {
  status_code: string;
  status_msg?: string;
  data: {
    file_path: string;
  };
}
