import ImageCompressor from './compressor';
import FileUploader from './uploader';
import { CompressUploadPayload, CompressUploadResult } from './types';
import { DEFAULT_UPLOAD_CONFIG, DEFAULT_QUALITY } from './config';

export class CompressUploadService {
  private uploader: FileUploader;

  constructor() {
    this.uploader = new FileUploader(DEFAULT_UPLOAD_CONFIG);
  }

  async processImage(
    payload: CompressUploadPayload,
    quality: number = DEFAULT_QUALITY,
  ): Promise<CompressUploadResult> {
    try {
      // 1. 压缩图片
      const compressedBuffer = await ImageCompressor.compress(
        payload.data,
        quality,
      );

      // 2. 上传文件
      const filePath = await this.uploader.upload(compressedBuffer);

      // 3. 返回结果
      return {
        success: true,
        filePath,
        previewData: compressedBuffer.toString('base64'),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  static async compressOnly(
    payload: CompressUploadPayload,
    quality: number = DEFAULT_QUALITY,
  ): Promise<Buffer> {
    return ImageCompressor.compress(payload.data, quality);
  }

  async uploadOnly(fileBuffer: Buffer): Promise<string> {
    return this.uploader.upload(fileBuffer);
  }

  updateUploadConfig(config: Partial<typeof DEFAULT_UPLOAD_CONFIG>): void {
    this.uploader.updateConfig(config);
  }
}

// 导出单例实例
export const compressUploadService = new CompressUploadService();

// 导出类型和配置
export * from './types';
export * from './config';
