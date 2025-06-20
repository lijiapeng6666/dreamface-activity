import FormData from 'form-data';
import { UploadConfig, ApiResponse } from './types';
import { SUCCESS_STATUS_CODE } from './config';

class FileUploader {
  private config: UploadConfig;

  constructor(config: UploadConfig) {
    this.config = config;
  }

  async upload(fileBuffer: Buffer): Promise<string> {
    try {
      // Dynamically import node-fetch
      const fetch = (await import('node-fetch')).default;

      const formData = new FormData();
      formData.append('user_id', this.config.userId);
      formData.append('file', fileBuffer, {
        filename: this.config.filename,
        contentType: this.config.contentType,
      });

      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error! status: ${response.status}`);
      }

      const result: ApiResponse = (await response.json()) as ApiResponse;

      if (result.status_code !== SUCCESS_STATUS_CODE) {
        throw new Error(result.status_msg || 'API returned an error');
      }

      return result.data.file_path;
    } catch (error) {
      // Remove console.error to fix ESLint warning
      // In a production environment, consider using a proper logging library
      throw new Error(
        `上传失败: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  updateConfig(newConfig: Partial<UploadConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): UploadConfig {
    return { ...this.config };
  }
}

export default FileUploader;
