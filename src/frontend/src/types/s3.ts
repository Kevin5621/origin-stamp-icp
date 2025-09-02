export interface S3Config {
  bucket_name: string;
  region: string;
  access_key_id: string;
  secret_access_key: string;
  endpoint?: string;
}

export interface UploadFileData {
  filename: string;
  content_type: string;
  file_size: number;
}

export interface UploadResult {
  success: boolean;
  message: string;
  file_url?: string;
  file_id?: string;
}

export interface PhysicalArtSession {
  session_id: string;
  username: string;
  art_title: string;
  description: string;
  uploaded_photos: string[];
  created_at: bigint;
  updated_at: bigint;
  status: string;
}
