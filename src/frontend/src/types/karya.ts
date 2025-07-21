// Tipe data untuk Karya sesuai dengan diagram ERD
export interface Karya {
  karya_id: string;
  user_id: string;
  tipe_karya: string;
  format_file: string;
  waktu_mulai: Date;
  waktu_selesai?: Date;
  nama_karya: string;
  deskripsi: string;
  status_karya: "draft" | "active" | "completed";
}

// Tipe data untuk Log Proses sesuai dengan diagram ERD
export interface LogProses {
  tindakan_id: string;
  karya_id: string;
  user_id: string;
  waktu_log: Date;
  jenis_log:
    | "start"
    | "update"
    | "milestone"
    | "completion"
    | "pause"
    | "resume";
  deskripsi_log: string;
}

// Tipe data untuk Karya dengan informasi tambahan
export interface KaryaWithLogs extends Karya {
  log_count?: number;
  last_log?: LogProses;
}

// Tipe data untuk status karya
export type StatusKarya = "draft" | "active" | "completed";

// Tipe data untuk jenis log
export type JenisLog =
  | "start"
  | "update"
  | "milestone"
  | "completion"
  | "pause"
  | "resume";

// Tipe data untuk tipe karya
export type TipeKarya =
  | "painting"
  | "sculpture"
  | "audio"
  | "digital"
  | "photography"
  | "craft"
  | "other";

// Tipe data untuk filter karya
export interface KaryaFilter {
  status?: StatusKarya;
  tipe_karya?: TipeKarya;
  date_from?: Date;
  date_to?: Date;
  search?: string;
}

// Tipe data untuk membuat karya baru
export interface CreateKaryaRequest {
  nama_karya: string;
  deskripsi: string;
  tipe_karya: TipeKarya;
  format_file: string;
}

// Tipe data untuk update status karya
export interface UpdateKaryaStatusRequest {
  karya_id: string;
  status_karya: StatusKarya;
  waktu_selesai?: Date;
}

// Tipe data untuk menambah log proses
export interface AddLogProsesRequest {
  karya_id: string;
  jenis_log: JenisLog;
  deskripsi_log: string;
}
