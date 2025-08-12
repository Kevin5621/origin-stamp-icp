# Session Page Synchronization with Smart Contract

## Overview

Saya telah berhasil menyinkronkan halaman session dengan data yang ada di smart contract Origin Stamp ICP. Perubahan ini memastikan bahwa data yang ditampilkan di frontend berasal langsung dari smart contract dan bukan mock data.

## Perubahan Utama

### 1. Import dan Dependencies

```tsx
import { useAuth } from "../../contexts/AuthContext";
import PhysicalArtService, {
  PhysicalArtSession,
} from "../../services/physicalArtService";
```

### 2. Updated Interface SessionData

Menambahkan field `username` untuk menampung data pemilik session:

```tsx
interface SessionData {
  id: string;
  title: string;
  description: string;
  artType: "physical" | "digital";
  createdAt: Date;
  updatedAt: Date;
  status: "draft" | "active" | "completed"; // Menambahkan status "draft"
  photoCount: number;
  username: string; // Field baru
}
```

### 3. Data Conversion Function

Membuat fungsi untuk mengkonversi data dari smart contract ke format frontend:

```tsx
const convertSmartContractSession = (
  smartContractSession: PhysicalArtSession,
): SessionData => {
  return {
    id: smartContractSession.session_id,
    title: smartContractSession.art_title,
    description: smartContractSession.description,
    artType: "physical", // Semua session dari smart contract adalah physical art
    createdAt: new Date(Number(smartContractSession.created_at) / 1000000), // Konversi nanoseconds ke milliseconds
    updatedAt: new Date(Number(smartContractSession.updated_at) / 1000000),
    status: smartContractSession.status as "draft" | "active" | "completed",
    photoCount: smartContractSession.uploaded_photos.length,
    username: smartContractSession.username,
  };
};
```

### 4. Real Data Loading

Mengganti mock data dengan data real dari smart contract:

```tsx
useEffect(() => {
  const loadUserSessions = async () => {
    if (!user?.username) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const userSessions = await PhysicalArtService.getUserSessions(
        user.username,
      );
      const convertedSessions = userSessions.map(convertSmartContractSession);
      setSessions(convertedSessions);
    } catch (error) {
      console.error("Failed to load sessions:", error);
      setError("Failed to load sessions. Please try again.");
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  loadUserSessions();
}, [user?.username]);
```

### 5. Enhanced Status Handling

Menambahkan support untuk status "draft" dan peningkatan UI:

```tsx
const getStatusBadge = (status: SessionData["status"]) => {
  const statusClasses = {
    draft: "session__status--draft",
    active: "session__status--active",
    completed: "session__status--completed",
  };

  const statusLabels = {
    draft: t("session.status.draft"),
    active: t("session.status.active"),
    completed: t("session.status.completed"),
  };

  return (
    <span className={`session__status ${statusClasses[status]}`}>
      {statusLabels[status]}
    </span>
  );
};
```

### 6. Error Handling

Menambahkan error state yang proper:

```tsx
if (error) {
  return (
    <div className="session">
      <div className="session__error">
        <p>{error}</p>
        <button className="btn-retry" onClick={() => window.location.reload()}>
          {t("session.retry")}
        </button>
      </div>
    </div>
  );
}
```

### 7. Authentication Check

Menambahkan check untuk user yang belum login:

```tsx
if (!user) {
  return (
    <div className="session">
      <div className="session__loading">
        <p>{t("session.please_login")}</p>
      </div>
    </div>
  );
}
```

## Translation Updates

### English (`en/session.json`)

```json
{
  "continue_session": "Continue Session",
  "view_certificate": "View Certificate",
  "loading_sessions": "Loading sessions...",
  "please_login": "Please login to view your sessions",
  "retry": "Retry",
  "status": {
    "draft": "Draft",
    "active": "Active",
    "completed": "Completed"
  }
}
```

### Indonesian (`id/session.json`)

```json
{
  "continue_session": "Lanjutkan Sesi",
  "view_certificate": "Lihat Sertifikat",
  "loading_sessions": "Memuat sesi...",
  "please_login": "Silakan login untuk melihat sesi Anda",
  "retry": "Coba Lagi",
  "status": {
    "draft": "Draft",
    "active": "Aktif",
    "completed": "Selesai"
  }
}
```

## CSS Updates

Menambahkan styles untuk draft status dan error state:

```scss
&__status {
  &--draft {
    background: var(--color-warning);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  // ... existing active and completed styles
}

&__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: var(--spacing-lg);
  // ... error styling
}
```

## Smart Contract Integration Points

### 1. PhysicalArtService.getUserSessions()

- Mengambil semua session milik user dari smart contract
- Return type: `PhysicalArtSession[]`

### 2. Data Mapping

- `session_id` → `id`
- `art_title` → `title`
- `description` → `description`
- `uploaded_photos.length` → `photoCount`
- `created_at` / `updated_at` → Date conversion (nanoseconds to milliseconds)
- `status` → direct mapping dengan type safety

### 3. Time Conversion

Smart contract menggunakan nanoseconds (bigint), sedangkan JavaScript Date menggunakan milliseconds:

```tsx
new Date(Number(smartContractSession.created_at) / 1000000);
```

## Benefits

1. **Real Data**: Halaman sekarang menampilkan data session yang sesungguhnya dari smart contract
2. **User-Specific**: Hanya menampilkan session milik user yang sedang login
3. **Status Handling**: Support untuk draft, active, dan completed status
4. **Error Handling**: Graceful error handling dengan retry mechanism
5. **Authentication**: Proper authentication check
6. **Performance**: Efficient data loading dengan proper loading states
7. **Type Safety**: Strong typing dengan TypeScript

## Next Steps

1. Implementasi refresh mechanism untuk auto-update data
2. Add pull-to-refresh untuk mobile
3. Implementasi infinite scroll jika session banyak
4. Add search dan filter functionality
5. Cache management untuk performance optimization

## Testing

Server development sudah berjalan di:

- Frontend: http://localhost:5173/
- Backend Candid: http://127.0.0.1:4943/?canisterId=be2us-64aaa-aaaaa-qaabq-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai

Untuk testing:

1. Login dengan user account
2. Buat session baru melalui create session page
3. Kembali ke session page untuk melihat data real dari smart contract
