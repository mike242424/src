import { NextResponse } from 'next/server';
import { Client } from 'minio';

interface Photo {
  name: string;
  url: string;
}

const minioClient = new Client({
  endPoint: '127.0.0.1',
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ROOT_USER || '',
  secretKey: process.env.MINIO_ROOT_PASSWORD || '',
});

export const GET = async () => {
  try {
    const bucket = 'photos';
    const photos: Photo[] = [];

    const stream = minioClient.listObjects(bucket, '', true);
    for await (const obj of stream) {
      const url = `http://127.0.0.1:9000/${bucket}/${obj.name}`;
      photos.push({ name: obj.name, url });
    }

    return NextResponse.json(photos, { status: 200 });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 },
    );
  }
};
