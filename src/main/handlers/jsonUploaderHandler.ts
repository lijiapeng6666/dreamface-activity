import { ipcMain } from 'electron';
import FileUploader from '../services/compress-upload/uploader';
import { DEFAULT_UPLOAD_CONFIG } from '../services/compress-upload/config';

function registerJsonUploaderHandlers() {
  ipcMain.handle(
    'upload-json',
    async (_, jsonContent: string): Promise<string> => {
      try {
        const fileBuffer = Buffer.from(jsonContent, 'utf-8');

        // TODO: Replace with your actual upload configuration
        const uploader = new FileUploader({
          apiUrl: DEFAULT_UPLOAD_CONFIG.apiUrl,
          userId: DEFAULT_UPLOAD_CONFIG.userId,
          filename: 'final_config.json',
          contentType: 'application/json',
        });

        const filePath = await uploader.upload(fileBuffer);
        return filePath;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error('JSON upload failed:', errorMessage);
        throw new Error(`JSON upload failed: ${errorMessage}`);
      }
    },
  );
}

export default registerJsonUploaderHandlers;
