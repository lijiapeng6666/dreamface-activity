import registerCompressUploadHandler from './compress-upload';
import registerJsonUploaderHandlers from './jsonUploaderHandler';

export default function registerAllHandlers(): void {
  registerCompressUploadHandler();
  registerJsonUploaderHandlers();
}
