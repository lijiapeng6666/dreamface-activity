import { ipcMain } from 'electron';
import {
  compressUploadService,
  CompressUploadService,
} from '../services/compress-upload';
import { CompressUploadPayload } from '../services/compress-upload/types';

export default function registerCompressUploadHandler(): void {
  ipcMain.handle(
    'compress-and-upload',
    async (_, payload: CompressUploadPayload, quality: number = 80) => {
      return compressUploadService.processImage(payload, quality);
    },
  );

  // 可以添加更多相关的处理器
  ipcMain.handle(
    'compress-only',
    async (_, payload: CompressUploadPayload, quality: number = 80) => {
      try {
        const compressedBuffer = await CompressUploadService.compressOnly(
          payload,
          quality,
        );
        return {
          success: true,
          data: compressedBuffer.toString('base64'),
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    },
  );
}
