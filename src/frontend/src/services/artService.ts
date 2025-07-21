import {
  KaryaWithLogs,
  LogProses,
  CreateKaryaRequest,
  UpdateKaryaStatusRequest,
  AddLogProsesRequest,
  KaryaFilter,
} from "../types/karya";

// Mock data untuk development - Audio dan Art Nyata
const mockKaryaData: KaryaWithLogs[] = [
  {
    karya_id: "karya-001",
    user_id: "user-001",
    nama_karya: "Lukisan Abstrak 'Harmoni Warna'",
    deskripsi:
      "Lukisan cat minyak dengan teknik abstrak ekspresionis, menggunakan palet warna cerah yang menggambarkan harmoni alam",
    tipe_karya: "painting",
    format_file: "Oil on Canvas",
    status_karya: "completed",
    waktu_mulai: new Date("2024-01-15"),
    waktu_selesai: new Date("2024-01-25"),
    log_count: 18,
  },
  {
    karya_id: "karya-002",
    user_id: "user-001",
    nama_karya: "Patung Kayu 'Spirit Alam'",
    deskripsi:
      "Patung kayu jati dengan ukiran tradisional yang menggambarkan roh alam dalam budaya lokal",
    tipe_karya: "sculpture",
    format_file: "Teak Wood",
    status_karya: "active",
    waktu_mulai: new Date("2024-02-01"),
    log_count: 12,
  },
  {
    karya_id: "karya-003",
    user_id: "user-001",
    nama_karya: "Album Musik 'Suara Kota'",
    deskripsi:
      "Album musik indie dengan 10 lagu yang menggambarkan kehidupan urban dan dinamika kota",
    tipe_karya: "audio",
    format_file: "WAV/MP3",
    status_karya: "draft",
    waktu_mulai: new Date("2024-02-10"),
    log_count: 5,
  },
  {
    karya_id: "karya-004",
    user_id: "user-001",
    nama_karya: "Lukisan Realis 'Potret Keluarga'",
    deskripsi:
      "Lukisan potret keluarga dengan teknik realis menggunakan cat minyak, menangkap momen kebersamaan",
    tipe_karya: "painting",
    format_file: "Oil on Canvas",
    status_karya: "completed",
    waktu_mulai: new Date("2024-01-05"),
    waktu_selesai: new Date("2024-01-20"),
    log_count: 22,
  },
  {
    karya_id: "karya-005",
    user_id: "user-001",
    nama_karya: "Podcast Series 'Cerita Seniman'",
    deskripsi:
      "Seri podcast 10 episode yang menampilkan wawancara dengan seniman lokal dan internasional",
    tipe_karya: "audio",
    format_file: "MP3",
    status_karya: "active",
    waktu_mulai: new Date("2024-02-15"),
    log_count: 8,
  },
  {
    karya_id: "karya-006",
    user_id: "user-001",
    nama_karya: "Patung Logam 'Modernitas'",
    deskripsi:
      "Patung logam dengan desain kontemporer yang menggambarkan kemajuan teknologi dan modernitas",
    tipe_karya: "sculpture",
    format_file: "Stainless Steel",
    status_karya: "draft",
    waktu_mulai: new Date("2024-02-20"),
    log_count: 3,
  },
];

const mockLogData: LogProses[] = [
  // Log untuk Lukisan Abstrak
  {
    tindakan_id: "log-001",
    karya_id: "karya-001",
    user_id: "user-001",
    waktu_log: new Date("2024-01-15T09:00:00"),
    jenis_log: "start",
    deskripsi_log:
      "Memulai sesi melukis dengan persiapan kanvas dan palet warna",
  },
  {
    tindakan_id: "log-002",
    karya_id: "karya-001",
    user_id: "user-001",
    waktu_log: new Date("2024-01-18T14:30:00"),
    jenis_log: "milestone",
    deskripsi_log:
      "Lapisan dasar warna selesai, mulai menambahkan detail abstrak",
  },
  {
    tindakan_id: "log-003",
    karya_id: "karya-001",
    user_id: "user-001",
    waktu_log: new Date("2024-01-25T16:00:00"),
    jenis_log: "completion",
    deskripsi_log: "Lukisan abstrak selesai dan siap untuk vernis final",
  },

  // Log untuk Patung Kayu
  {
    tindakan_id: "log-004",
    karya_id: "karya-002",
    user_id: "user-001",
    waktu_log: new Date("2024-02-01T08:00:00"),
    jenis_log: "start",
    deskripsi_log:
      "Memulai pengerjaan patung dengan pemilihan kayu jati berkualitas",
  },
  {
    tindakan_id: "log-005",
    karya_id: "karya-002",
    user_id: "user-001",
    waktu_log: new Date("2024-02-10T11:00:00"),
    jenis_log: "milestone",
    deskripsi_log:
      "Bentuk dasar patung selesai, mulai detail ukiran tradisional",
  },

  // Log untuk Album Musik
  {
    tindakan_id: "log-006",
    karya_id: "karya-003",
    user_id: "user-001",
    waktu_log: new Date("2024-02-10T10:00:00"),
    jenis_log: "start",
    deskripsi_log: "Memulai proyek album dengan brainstorming konsep dan tema",
  },
  {
    tindakan_id: "log-007",
    karya_id: "karya-003",
    user_id: "user-001",
    waktu_log: new Date("2024-02-15T15:00:00"),
    jenis_log: "update",
    deskripsi_log: "Selesai menulis lirik untuk 3 lagu pertama",
  },

  // Log untuk Lukisan Realis
  {
    tindakan_id: "log-008",
    karya_id: "karya-004",
    user_id: "user-001",
    waktu_log: new Date("2024-01-05T09:00:00"),
    jenis_log: "start",
    deskripsi_log:
      "Memulai lukisan potret dengan sketsa awal dan persiapan kanvas",
  },
  {
    tindakan_id: "log-009",
    karya_id: "karya-004",
    user_id: "user-001",
    waktu_log: new Date("2024-01-12T13:00:00"),
    jenis_log: "milestone",
    deskripsi_log: "Sketsa dan outline wajah selesai, mulai pewarnaan kulit",
  },
  {
    tindakan_id: "log-010",
    karya_id: "karya-004",
    user_id: "user-001",
    waktu_log: new Date("2024-01-20T17:00:00"),
    jenis_log: "completion",
    deskripsi_log: "Lukisan potret keluarga selesai dengan detail sempurna",
  },
];

export class KaryaService {
  // Mendapatkan semua karya user
  static async getKaryaByUser(
    userId: string,
    filter?: KaryaFilter,
  ): Promise<KaryaWithLogs[]> {
    // Simulasi API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredKarya = mockKaryaData.filter(
      (karya) => karya.user_id === userId,
    );

    if (filter) {
      if (filter.status) {
        filteredKarya = filteredKarya.filter(
          (karya) => karya.status_karya === filter.status,
        );
      }
      if (filter.tipe_karya) {
        filteredKarya = filteredKarya.filter(
          (karya) => karya.tipe_karya === filter.tipe_karya,
        );
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filteredKarya = filteredKarya.filter(
          (karya) =>
            karya.nama_karya.toLowerCase().includes(searchLower) ||
            karya.deskripsi.toLowerCase().includes(searchLower),
        );
      }
      if (filter.date_from) {
        filteredKarya = filteredKarya.filter(
          (karya) => karya.waktu_mulai >= filter.date_from!,
        );
      }
      if (filter.date_to) {
        filteredKarya = filteredKarya.filter(
          (karya) => karya.waktu_mulai <= filter.date_to!,
        );
      }
    }

    return filteredKarya;
  }

  // Mendapatkan detail karya berdasarkan ID
  static async getKaryaById(karyaId: string): Promise<KaryaWithLogs | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const karya = mockKaryaData.find((k) => k.karya_id === karyaId);
    if (!karya) return null;

    // Tambahkan log terakhir jika ada
    const lastLog = mockLogData
      .filter((log) => log.karya_id === karyaId)
      .sort((a, b) => b.waktu_log.getTime() - a.waktu_log.getTime())[0];

    return {
      ...karya,
      last_log: lastLog,
    };
  }

  // Membuat karya baru
  static async createKarya(
    request: CreateKaryaRequest,
    userId: string,
  ): Promise<KaryaWithLogs> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newKarya: KaryaWithLogs = {
      karya_id: `karya-${Date.now()}`,
      user_id: userId,
      nama_karya: request.nama_karya,
      deskripsi: request.deskripsi,
      tipe_karya: request.tipe_karya,
      format_file: request.format_file,
      status_karya: "draft",
      waktu_mulai: new Date(),
      log_count: 0,
    };

    mockKaryaData.push(newKarya);
    return newKarya;
  }

  // Update status karya
  static async updateKaryaStatus(
    request: UpdateKaryaStatusRequest,
  ): Promise<KaryaWithLogs> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const karyaIndex = mockKaryaData.findIndex(
      (k) => k.karya_id === request.karya_id,
    );
    if (karyaIndex === -1) {
      throw new Error("Karya tidak ditemukan");
    }

    mockKaryaData[karyaIndex] = {
      ...mockKaryaData[karyaIndex],
      status_karya: request.status_karya,
      waktu_selesai: request.waktu_selesai,
    };

    return mockKaryaData[karyaIndex];
  }

  // Menambah log proses
  static async addLogProses(request: AddLogProsesRequest): Promise<LogProses> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newLog: LogProses = {
      tindakan_id: `log-${Date.now()}`,
      karya_id: request.karya_id,
      user_id: "user-001", // TODO: Get from auth context
      waktu_log: new Date(),
      jenis_log: request.jenis_log,
      deskripsi_log: request.deskripsi_log,
    };

    mockLogData.push(newLog);

    // Update log count di karya
    const karyaIndex = mockKaryaData.findIndex(
      (k) => k.karya_id === request.karya_id,
    );
    if (karyaIndex !== -1) {
      mockKaryaData[karyaIndex].log_count =
        (mockKaryaData[karyaIndex].log_count || 0) + 1;
    }

    return newLog;
  }

  // Mendapatkan log proses untuk karya tertentu
  static async getLogProsesByKarya(karyaId: string): Promise<LogProses[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return mockLogData
      .filter((log) => log.karya_id === karyaId)
      .sort((a, b) => a.waktu_log.getTime() - b.waktu_log.getTime());
  }

  // Mendapatkan statistik karya
  static async getKaryaStats(userId: string) {
    const karya = await this.getKaryaByUser(userId);

    return {
      total: karya.length,
      completed: karya.filter((k) => k.status_karya === "completed").length,
      active: karya.filter((k) => k.status_karya === "active").length,
      draft: karya.filter((k) => k.status_karya === "draft").length,
      totalLogs: karya.reduce((sum, k) => sum + (k.log_count || 0), 0),
    };
  }
}
