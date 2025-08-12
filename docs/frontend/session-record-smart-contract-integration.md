# Session Record Page - Smart Contract Integration

## Overview

Saya telah berhasil memperbaiki dan menyinkronkan halaman session record (`sessions/session-{sessionId}`) dengan smart contract, termasuk:

1. **Photo Log Integration**: Photo log sekarang menampilkan data real dari smart contract
2. **NFT Generation**: Fungsi Generate NFT diperbaiki untuk menggunakan smart contract secara real
3. **Real S3 Upload**: Upload foto sekarang benar-benar upload ke S3 dan record di smart contract

## Perubahan Utama

### 1. Updated Imports dan Dependencies

```tsx
import { useAuth } from "../../contexts/AuthContext";
import PhysicalArtService, {
  PhysicalArtSession,
} from "../../services/physicalArtService";
import { backend } from "../../../../declarations/backend";
import { Principal } from "@dfinity/principal";
```

### 2. Enhanced Interface Types

```tsx
// Updated interface to match smart contract data
interface SessionData {
  id: string;
  title: string;
  description: string;
  artType: "physical" | "digital";
  status: "draft" | "active" | "completed"; // Added draft status
  createdAt: Date;
  photos: PhotoLog[];
  currentStep: number;
  nftGenerated?: boolean;
  username: string; // Added username
  updatedAt: Date; // Added updatedAt
}

// PhotoLog interface updated untuk real S3 URLs
interface PhotoLog {
  id: string;
  filename: string;
  timestamp: Date;
  description: string;
  fileSize: number;
  url: string; // Real S3 URL from smart contract
  step: number;
  s3Key?: string;
}
```

### 3. Data Loading dari Smart Contract

Mengganti mock data dengan data real dari smart contract:

```tsx
// Helper function to convert smart contract session to SessionData
const convertSmartContractSession = (
  smartContractSession: PhysicalArtSession,
): SessionData => {
  // Convert uploaded photos to PhotoLog format
  const photos: PhotoLog[] = smartContractSession.uploaded_photos.map(
    (url, index) => ({
      id: `photo-${index + 1}`,
      filename: url.split("/").pop() || `photo-${index + 1}.jpg`,
      timestamp: new Date(Number(smartContractSession.updated_at) / 1000000),
      description: `Photo ${index + 1}`,
      fileSize: 0, // File size not stored in smart contract
      url: url, // Real S3 URL
      step: index + 1,
      s3Key: url.split("/").slice(-2).join("/"), // Extract S3 key from URL
    }),
  );

  return {
    id: smartContractSession.session_id,
    title: smartContractSession.art_title,
    description: smartContractSession.description,
    artType: "physical",
    status: smartContractSession.status as "draft" | "active" | "completed",
    createdAt: new Date(Number(smartContractSession.created_at) / 1000000),
    updatedAt: new Date(Number(smartContractSession.updated_at) / 1000000),
    username: smartContractSession.username,
    photos: photos,
    currentStep: photos.length,
    nftGenerated: false, // This would need to be checked against NFT records
  };
};

// Load session data from smart contract
useEffect(() => {
  const loadSessionData = async () => {
    if (!sessionId) {
      setError("Session ID is required");
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const sessionDetails =
        await PhysicalArtService.getSessionDetails(sessionId);

      if (!sessionDetails) {
        setError("Session not found");
        setIsLoading(false);
        return;
      }

      const convertedSession = convertSmartContractSession(sessionDetails);
      setSession(convertedSession);
    } catch (error) {
      console.error("Failed to load session:", error);
      setError("Failed to load session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  loadSessionData();
}, [sessionId]);
```

### 4. Real Photo Upload Implementation

Upload foto sekarang benar-benar upload ke S3 dan record di smart contract:

```tsx
// Real upload to S3 and smart contract
for (let i = 0; i < filesArray.length; i++) {
  // Check for cancellation
  if (cancelRef.current) {
    console.log("Upload cancelled at file", i);
    addToast("warning", t("session.upload_cancelled_by_user_message"));
    return;
  }

  const file = filesArray[i];

  try {
    // Upload file using PhysicalArtService
    const uploadResult = await PhysicalArtService.uploadPhoto(session.id, file);

    if (uploadResult.success && uploadResult.file_url) {
      // Create photo log entry with real S3 URL
      const newPhoto: PhotoLog = {
        id: `photo-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
        filename: file.name,
        timestamp: new Date(),
        description:
          stepDescription ||
          `${t("session.step")} ${session.currentStep + i + 1}`,
        fileSize: file.size,
        url: uploadResult.file_url, // Real S3 URL
        step: session.currentStep + i + 1,
        s3Key:
          uploadResult.file_id || `sessions/${session.id}/photos/${file.name}`,
      };

      newPhotos.push(newPhoto);

      // Update progress
      setUploadProgress(((i + 1) * 100) / filesArray.length);
      setUploadedFiles(i + 1);
    } else {
      throw new Error(uploadResult.message || "Upload failed");
    }
  } catch (uploadError) {
    console.error("Failed to upload file:", uploadError);
    addToast("error", `Failed to upload ${file.name}: ${uploadError}`);
    // Continue with other files
  }
}
```

### 5. Enhanced Photo Delete Function

Delete foto sekarang juga menghapus dari smart contract:

```tsx
const handleDeletePhoto = async (photoId: string) => {
  if (!session) return;

  const photoToDelete = session.photos.find((p) => p.id === photoId);
  if (!photoToDelete) return;

  try {
    // Remove photo from smart contract
    const success = await PhysicalArtService.removePhotoFromSession(
      session.id,
      photoToDelete.url,
    );

    if (success) {
      // Update local state
      setSession({
        ...session,
        photos: session.photos.filter((p) => p.id !== photoId),
      });

      addToast(
        "success",
        t("session.photo_deleted_success", {
          filename: photoToDelete.filename,
        }),
      );
    } else {
      addToast("error", "Failed to delete photo from smart contract");
    }
  } catch (error) {
    console.error("Failed to delete photo:", error);
    addToast("error", "Failed to delete photo");
  }
};
```

### 6. Real NFT Generation Implementation

Fungsi Generate NFT sekarang benar-benar mint NFT di smart contract:

```tsx
const handleCompleteSessionAndGenerateNFT = async () => {
  if (!session || !user) return;

  setIsGeneratingNFT(true);
  addToast("info", t("session.starting_nft_generation_process"));

  try {
    // First, update session status to completed
    const statusUpdated = await PhysicalArtService.updateSessionStatus(
      session.id,
      "completed",
    );

    if (!statusUpdated) {
      throw new Error("Failed to update session status");
    }

    // Create recipient account (user's principal)
    const userPrincipal = Principal.fromText(
      user.principal || Principal.anonymous().toString(),
    );
    const recipient = {
      owner: userPrincipal,
      subaccount: [] as [],
    };

    // Additional attributes for the NFT
    const additionalAttributes: [string, string][] = [
      ["creation_method", "physical_art_documentation"],
      ["total_photos", session.photos.length.toString()],
      ["completion_date", new Date().toISOString()],
    ];

    // Mint NFT from session
    const mintResult = await backend.mint_nft_from_session(
      session.id,
      recipient,
      additionalAttributes,
    );

    if ("Ok" in mintResult) {
      const tokenId = mintResult.Ok;

      // Update local session state
      setSession((prev) =>
        prev
          ? {
              ...prev,
              status: "completed",
              nftGenerated: true,
            }
          : null,
      );

      addToast("success", `NFT generated successfully! Token ID: ${tokenId}`);

      // Navigate to certificate page with token ID
      navigate(`/certificate/${session.id}?tokenId=${tokenId}`);
    } else {
      throw new Error(mintResult.Err);
    }
  } catch (error) {
    console.error("Failed to generate NFT:", error);
    addToast("error", `Failed to generate NFT: ${error}`);
  } finally {
    setIsGeneratingNFT(false);
  }
};
```

### 7. Enhanced Loading dan Error States

```tsx
if (isLoading) {
  return (
    <div className="session-record">
      <div className="session-record__loading">
        <div className="loading-spinner" />
        <p>{t("session.loading_session")}</p>
      </div>
    </div>
  );
}

if (error) {
  return (
    <div className="session-record">
      <div className="session-record__error">
        <p>{error}</p>
        <button className="btn-retry" onClick={() => window.location.reload()}>
          {t("session.retry")}
        </button>
      </div>
    </div>
  );
}

if (!session) {
  return (
    <div className="session-record">
      <div className="session-record__error">
        <p>{t("session.session_not_found")}</p>
        <button className="btn-back" onClick={() => navigate("/session")}>
          {t("session.back_to_sessions")}
        </button>
      </div>
    </div>
  );
}
```

## Smart Contract Integration Points

### 1. PhysicalArtService.getSessionDetails()

- Mengambil detail session dari smart contract
- Return: `PhysicalArtSession | null`

### 2. PhysicalArtService.uploadPhoto()

- Upload foto ke S3 dan record URL di smart contract
- Return: `UploadResult` dengan `file_url` dan `file_id`

### 3. PhysicalArtService.removePhotoFromSession()

- Menghapus foto dari smart contract
- Return: `boolean` success status

### 4. PhysicalArtService.updateSessionStatus()

- Update status session ke "completed"
- Return: `boolean` success status

### 5. backend.mint_nft_from_session()

- Mint NFT dari session data
- Parameters: `session_id`, `recipient`, `additional_attributes`
- Return: `Result<u64, string>` dengan token ID

## Data Flow

```
User Upload Photo → PhysicalArtService.uploadPhoto() → S3 Upload → Smart Contract Record → UI Update

User Delete Photo → PhysicalArtService.removePhotoFromSession() → Smart Contract Remove → UI Update

User Generate NFT → Update Session Status → Mint NFT → Navigate to Certificate
```

## NFT Metadata yang Dibuat

Saat NFT di-mint, metadata berikut otomatis disertakan:

- `session_id`: ID session asal
- `artist`: Username pembuat session
- `art_title`: Judul artwork
- `created_at`: Timestamp pembuatan NFT
- `token_hash`: Hash unik untuk token
- `photo_count`: Jumlah foto dalam session
- `photo_1`, `photo_2`, dst.: URL foto-foto yang diupload
- `creation_method`: "physical_art_documentation"
- `total_photos`: Jumlah total foto
- `completion_date`: Tanggal penyelesaian

## Benefits

1. **Real Data**: Photo log menampilkan data real dari smart contract
2. **Real Upload**: Upload foto benar-benar ke S3 dengan record di smart contract
3. **Real NFT**: Generate NFT benar-benar mint token di smart contract ICRC-7
4. **Error Handling**: Proper error handling untuk semua operasi
5. **Loading States**: Loading states yang proper untuk UX yang baik
6. **Type Safety**: Strong typing dengan TypeScript
7. **Authentication**: Integrasi dengan user authentication
8. **Data Consistency**: Sinkronisasi antara UI dan smart contract

## Next Steps

1. Implementasi certificate page untuk menampilkan NFT yang di-mint
2. Add functionality untuk view NFT details
3. Implementasi marketplace integration
4. Add batch upload functionality
5. Add photo preview dengan zoom
6. Implementasi photo editing features

Sekarang session record page sudah fully integrated dengan smart contract dan dapat melakukan upload foto real ke S3 serta generate NFT yang benar-benar di-mint di blockchain ICP.
