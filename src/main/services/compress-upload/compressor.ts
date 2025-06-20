import sharp from 'sharp';

class ImageCompressor {
  static async compress(
    input: string | Buffer,
    quality: number = 80,
  ): Promise<Buffer> {
    try {
      const compressedImageBuffer = await sharp(input)
        .jpeg({ quality })
        .toBuffer();

      return compressedImageBuffer;
    } catch (error) {
      throw new Error(
        `压缩失败: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  static async getImageInfo(input: string | Buffer): Promise<sharp.Metadata> {
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
