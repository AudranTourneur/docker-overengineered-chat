import * as Minio from 'minio'
import { GlobalEnv } from './env';

new Minio.Client({
  endPoint: GlobalEnv.MINIO_HOST,
  port: Number(GlobalEnv.MINIO_PORT),
  useSSL: false,
  accessKey: GlobalEnv.MINIO_ACCESS_KEY,
  secretKey: GlobalEnv.MINIO_SECRET_KEY,
})

export const GlobalMinioClient = null;
