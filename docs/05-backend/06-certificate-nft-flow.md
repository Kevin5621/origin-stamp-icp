# Certificate & NFT Generation Flow

## Overview

Flow generate sertifikat NFT di IC-Vibe terdiri dari beberapa tahap yang terintegrasi antara frontend dan backend untuk menghasilkan sertifikat digital dan NFT yang dapat diverifikasi.

## Architecture

### Backend (Rust)

#### 1. Certificate Generation (`generate_certificate`)

```rust
#[ic_cdk::update]
pub fn generate_certificate(request: CreateCertificateRequest) -> Result<Certificate, String>
```

**Input Validation:**

- Session ID tidak boleh kosong
- Username tidak boleh kosong
- Art title tidak boleh kosong
- Description tidak boleh kosong
- Photo count harus > 0
- Creation duration harus > 0
- File format tidak boleh kosong
- Creation tools tidak boleh kosong

**Process:**

1. Validasi session exists dan status valid
2. Generate certificate ID unik
3. Generate verification hash menggunakan SHA256
4. Generate blockchain transaction hash
5. Calculate verification scores berdasarkan session data
6. Set expiry date (10 tahun)
7. Store certificate ke storage

**Output:**

```rust
pub struct Certificate {
    pub certificate_id: String,
    pub session_id: String,
    pub username: String,
    pub art_title: String,
    pub description: String,
    pub issue_date: u64,
    pub expiry_date: u64,
    pub verification_hash: String,
    pub blockchain_tx: String,
    pub qr_code_data: String,
    pub verification_url: String,
    pub certificate_type: String,
    pub verification_score: u32,
    pub authenticity_rating: u32,
    pub provenance_score: u32,
    pub community_trust: u32,
    pub certificate_status: String,
    pub issuer: String,
    pub blockchain: String,
    pub token_standard: String,
    pub metadata: CertificateMetadata,
}
```

#### 2. NFT Generation (`generate_nft_for_certificate`)

```rust
#[ic_cdk::update]
pub fn generate_nft_for_certificate(certificate_id: String) -> Result<NFTGenerationResult, String>
```

**Process:**

1. Validasi certificate exists dan status active
2. Generate NFT ID unik
3. Create token URI untuk metadata

**Output:**

```rust
pub struct NFTGenerationResult {
    pub nft_id: String,
    pub token_uri: String,
}
```

#### 3. NFT Metadata (`get_nft_metadata`)

```rust
#[ic_cdk::query]
pub fn get_nft_metadata(certificate_id: String) -> Option<String>
```

**Output:** JSON metadata dengan format:

```json
{
  "name": "IC-Vibe Certificate NFT - {Art Title}",
  "description": "Digital certificate for artwork: {Art Title}",
  "image": "https://ic-vibe.ic0.app/certificate/{certificate_id}/image",
  "attributes": [
    {
      "trait_type": "Certificate ID",
      "value": "{certificate_id}"
    },
    {
      "trait_type": "Art Title",
      "value": "{art_title}"
    },
    {
      "trait_type": "Artist",
      "value": "{username}"
    },
    {
      "trait_type": "Verification Score",
      "value": {verification_score}
    },
    {
      "trait_type": "Authenticity Rating",
      "value": {authenticity_rating}
    },
    {
      "trait_type": "Creation Duration",
      "value": "{creation_duration}"
    },
    {
      "trait_type": "Issue Date",
      "value": "{issue_date}"
    },
    {
      "trait_type": "Blockchain",
      "value": "{blockchain}"
    }
  ],
  "external_url": "{verification_url}",
  "verification_hash": "{verification_hash}"
}
```

### Frontend (React + TypeScript)

#### 1. Certificate Service

**Complete Certificate Generation Flow:**

```typescript
static async completeCertificateGeneration(
  sessionId: string,
  username: string,
  artTitle: string,
  description: string,
  photoCount: number,
  creationDuration: number,
  fileFormat: string = "JPEG/PNG",
  creationTools: string[] = ["Digital Camera", "IC-Vibe Platform"]
): Promise<{
  success: boolean;
  certificate?: CertificateData;
  nft?: { nft_id: string; token_uri: string };
  error?: string;
}>
```

**Process:**

1. Generate certificate menggunakan backend
2. Generate NFT untuk certificate
3. Return complete result dengan certificate dan NFT data

#### 2. Session Record Page

**Flow Integration:**

```typescript
const handleCompleteSessionAndGenerateNFT = async () => {
  // 1. Validate session data
  if (!session.title || !session.description || session.photos.length === 0) {
    addToast("error", t("session.incomplete_session_data"));
    return;
  }

  // 2. Calculate creation duration
  const creationDuration = Math.floor(
    (Date.now() - session.createdAt.getTime()) / (1000 * 60),
  );

  // 3. Validate creation duration
  if (creationDuration <= 0) {
    throw new Error("Invalid creation duration calculated");
  }

  // 4. Complete certificate generation
  const result = await CertificateService.completeCertificateGeneration(
    session.id,
    user.username,
    session.title,
    session.description,
    session.photos.length,
    creationDuration,
    "JPEG/PNG",
    ["Digital Camera", "IC-Vibe Platform"],
  );

  // 5. Handle result and navigate
  if (result.success) {
    navigate(`/certificate/${result.certificate.certificate_id}`, {
      state: { nftData: result.nft },
    });
  }
};
```

#### 3. NFT Display Component

**Features:**

- Display NFT metadata dengan visual yang menarik
- Download metadata JSON
- Share NFT ke social media
- Copy verification hash
- View on blockchain
- Responsive design untuk mobile dan desktop

## Data Flow

```
User completes session
         ↓
Validate session data
         ↓
Calculate creation duration
         ↓
Backend: generate_certificate()
         ↓
Backend: generate_nft_for_certificate()
         ↓
Frontend: display certificate + NFT
         ↓
User can view, share, verify
```

## Error Handling

### Backend Validation

- Input parameter validation
- Session status validation
- Certificate existence validation
- Proper error messages untuk debugging

### Frontend Error Handling

- Session data validation
- Creation duration validation
- Network error handling
- User-friendly error messages
- Retry mechanisms

## Security Features

1. **Verification Hash:** SHA256 hash dari session data + timestamp
2. **Blockchain TX:** Hash dari certificate ID + verification hash + timestamp
3. **Immutable Data:** Semua data tersimpan di Internet Computer blockchain
4. **Access Control:** Hanya user yang memiliki session yang bisa generate certificate

## Future Enhancements

1. **Batch Processing:** Generate multiple certificates sekaligus
2. **Advanced Metadata:** Support untuk custom attributes
3. **Multi-chain Support:** Support untuk blockchain lain selain ICP
4. **Automated Verification:** AI-powered verification system
5. **Marketplace Integration:** NFT trading platform

## Testing

### Backend Tests

- Input validation tests
- Certificate generation tests
- NFT generation tests
- Error handling tests

### Frontend Tests

- Component rendering tests
- Service integration tests
- Error handling tests
- User flow tests

## Deployment

1. **Backend:** Deploy ke Internet Computer
2. **Frontend:** Build dan deploy ke hosting service
3. **Environment Variables:** Configure untuk production
4. **Monitoring:** Setup logging dan error tracking

## Troubleshooting

### Common Issues

1. **Creation Duration Null:** Pastikan session.createdAt valid
2. **Session Not Found:** Validasi session ID exists
3. **Invalid Input:** Check semua required fields
4. **Network Errors:** Verify backend connectivity

### Debug Steps

1. Check browser console untuk error messages
2. Verify backend logs untuk validation errors
3. Test dengan sample data
4. Check network requests di browser dev tools
