import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client, { BUCKET_NAME } from "@/lib/s3";
import ffmpeg from 'fluent-ffmpeg';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { createReadStream } from 'fs';
import os from 'os';

export async function POST(request: NextRequest) {
  const tempFiles: string[] = [];
  
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = file.name;
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    
    let finalBuffer: Buffer | null = null;
    let finalFileName = `${Date.now()}-${originalName}`;
    let finalContentType = file.type;

    // Create a temp directory for processing
    const tempDir = os.tmpdir();
    const inputPath = path.join(tempDir, `input-${Date.now()}-${originalName}`);
    await fs.writeFile(inputPath, buffer);
    tempFiles.push(inputPath);

    if (isVideo) {
      // Compress Video
      const outputName = `compressed-${Date.now()}.mp4`;
      const outputPath = path.join(tempDir, outputName);
      tempFiles.push(outputPath);

      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputPath)
          .outputOptions([
            '-c:v libx264',
            '-crf 28',         // Balance between quality and size (23-28 is good)
            '-preset faster',
            '-vf scale=-2:720', // Scale to 720p height
            '-an',             // Remove audio for hero background (save space)
            '-movflags +faststart' // Better for web streaming
          ])
          .toFormat('mp4')
          .on('end', () => resolve())
          .on('error', (err) => reject(err))
          .save(outputPath);
      });

      finalBuffer = await fs.readFile(outputPath);
      finalFileName = `${Date.now()}-compressed.mp4`;
      finalContentType = 'video/mp4';
    } 
    else if (isImage && !file.type.includes('svg') && !file.type.includes('gif')) {
      // Compress Image to WebP
      finalBuffer = await sharp(buffer)
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
      finalFileName = `${Date.now()}.webp`;
      finalContentType = 'image/webp';
    } 
    else {
      // For other files (SVG, GIF, etc.), use original buffer
      finalBuffer = buffer;
    }

    // Upload to R2/S3
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: finalFileName,
      Body: finalBuffer,
      ContentType: finalContentType,
    });

    await s3Client.send(command);

    const fileUrl = `${process.env.R2_PUBLIC_URL}/${finalFileName}`;

    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      key: finalFileName 
    });

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    // Clean up temp files
    for (const f of tempFiles) {
      try {
        await fs.unlink(f);
      } catch (e) {
        // ignore error
      }
    }
  }
}
