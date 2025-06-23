import sharp from 'sharp';

class ImageCompressor {
  static async compress(
    input: string | Buffer,
    quality: number = 80,
  ): Promise<Buffer> {
    try {
      const compressedImageBuffer = await sharp(input)
        .png({ quality, compressionLevel: 9 })
        .toBuffer();

      return compressedImageBuffer;
    } catch (error) {
      throw new Error(
        `压缩失败: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  static async getImageMetadata(
    input: string | Buffer,
  ): Promise<sharp.Metadata> {
    try {
      const metadata = await sharp(input).metadata();
      return metadata;
    } catch (error) {
      throw new Error(
        `获取图片信息失败: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}

export default ImageCompressor;
