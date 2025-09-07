## PRD: AI Verification & Scoring for Proof-of-Process

Versi: 0.1
Tanggal: 2025-09-07
Owner: Product / Integration Engineer

### Ringkasan singkat

Fitur ini menambahkan verifikasi otomatis dan scoring berbasis AI pada alur "proof-of-process" ketika artisan mengunggah rangkaian foto selama sesi pembuatan karya fisik. Tujuan utama: deteksi foto out-of-context, berikan skor yang dapat dijelaskan, tampilkan bukti/evidence, dan sediakan mekanisme manual review serta integrasi ke flow minting NFT (di-backend + canister). Implementasi awal memanfaatkan model pretrained (mis. CLIP/BLIP) sehingga tidak membutuhkan dataset latih berbayar.

### Goals

- Mendeteksi foto yang tidak relevan (out-of-context) dalam urutan proses tanpa dataset khusus (memakai embedding & captioning pretrained).
- Menghasilkan skor explainable (0-100) yang merefleksikan konsistensi proses.
- Menyediakan UI untuk menampilkan per-step evidence, anomaly highlight, dan tombol manual verify / override.
- Mengintegrasikan hasil verifikasi ringkas ke backend dan canister (hanya ringkasan + score on-chain).

### Non-Goals (saat ini)

- Menyimpan seluruh bukti visual di chain (hanya S3 link/hashes disimpan on-chain).
- Melatih model ML custom dari awal.

### Target pengguna

- Artisan (user yang mengunggah proof photos)
- Reviewer/admin yang melakukan manual verification
- Pembeli/marketplace yang melihat badge/score pada NFT

### Sukses Kriteria (KPIs)

- 95% dari upload menampilkan hasil verifikasi dalam < 10s (CPU mode) atau < 2s (GPU mode) untuk small images.
- Human override rate turun ke < 10% setelah 4 minggu (tuning thresholds).
- Peningkatan rate listing terjual dari artworks dengan score >= 85 vs < 50 (to be measured).

## High-level Architecture

- Frontend (plugin/website) — upload file ke S3 via presigned URL, kirim metadata (sha256, s3_url) ke backend session API.
- Backend API — menerima metadata, buat session asset record (verification.status = pending), enqueue verification job.
- Worker (AI verifier) — ambil file dari S3, jalankan inference (open-source models: OpenCLIP, BLIP), compute embeddings & captions, hitung per-step similarity, deteksi anomaly, keluarkan score + evidence (small thumbnails, captions, similarity values), tulis hasil ke DB, lalu panggil canister (atau backend update) untuk menyimpan ringkasan on-chain.
- Storage — S3 untuk image & evidence; DB untuk metadata & verification state; Canister untuk final score & verification status (ringkasan kecil).

Diagram singkat (logis):

Frontend -> S3 (presign) -> Backend record -> Queue -> Worker -> DB -> Canister

## Data & Metadata

Minimal metadata yang dikumpulkan saat upload asset:

- sessionId: string
- assetId: string
- s3_url: string
- filename: string
- contentType: string
- sha256: string
- uploadTimestamp: ISO
- userPrincipal / userId
- stepIndex: integer (urutan foto)

Verification summary (yang disimpan di DB dan on-chain ringkas):

- verification: {
  status: "pending" | "verified" | "review_needed" | "rejected",
  finalScore: number (0..100),
  baseSimilarity: float (0..1),
  anomalyCount: int,
  breakdown: { authenticity?:float, process_steps?:float, context_relevance?:float, tampering?:float },
  modelVersion: string,
  evidenceUrls: [string] (small thumbnails or captions),
  checkedAt: ISO
  }

Catatan: hanya simpan evidenceUrls kecil; semua gambar full-size tetap di S3.

## Scoring & Detection (Teknis)

Pendekatan tanpa dataset: gunakan model pretrained untuk ekstraksi embedding dan captioning.

Komponen utama:

- Embedding: pakai OpenCLIP / ViT-B/32 untuk menghasilkan v_i per foto.
- Captioning: pakai BLIP (opsional) untuk membuat teks ringkasan tiap foto.
- Similarity metric: cosine similarity untuk embedding; text similarity (or cosine on text embeddings) untuk caption.

Algoritma ringkas:

1. Hitung embedding untuk setiap gambar: v_0..v_n.
2. Hitung similarity berurutan: s*i = cosine(v_i, v*{i-1}) untuk i in 1..n.
3. Hitung caption similarity c*i (opsional): cosine(emb(caption_i), emb(caption*{i-1})).
4. Per-step score: step*score_i = w1 * s*i + w2 * c_i + w3 \* metadata_consistency
5. Base = mean(step_score_i) (0..1)
6. Penalize anomalies: final = base _ (1 - alpha _ anomaly_count / max(1, n))
7. Map final ke 0..100

Thresholds contoh (tuneable):

- T_drop (anomaly) = 0.55 (cosine) ; T_caption = 0.4
- alpha (penalty factor) = 0.25

Pseudocode singkat:

```python
# compute embs = [emb(img) for img in images]
sims = [cosine(embs[i], embs[i-1]) for i in range(1,len(embs))]
anomalies = [i for i,s in enumerate(sims, start=1) if s < T_drop]
base = mean(sims)
final = base * (1 - alpha * len(anomalies)/max(1,len(sims)))
score = round(final*100,2)
```

Evidence yang dihasilkan per anomaly: thumbnail crop (optional), caption teks, similarity value.

## API / Backend Endpoints (kontrak minimal)

Catatan: ikuti pola REST yang ada di repo. Contoh endpoints:

- POST /api/sessions/:sessionId/assets

  - payload: { s3_url, filename, sha256, stepIndex }
  - returns: { assetId, verification: { status: pending }}

- POST /api/verification/:assetId/trigger (internal)

  - trigger enqueue job (worker)

- GET /api/sessions/:sessionId/verification

  - returns verification summary + per-step metrics

- POST /api/sessions/:sessionId/assets/:assetId/delete

  - deletes S3 object (backend does deletion) and updates DB, calls canister to update record

- POST /api/sessions/:sessionId/verify/manual
  - reviewer action: { assetId, action: approve|reject|adjustScore, notes }

Worker responsibilities:

- download S3 image, run inference, store minimal evidence (thumbnails/captions), write verification record, and call canister API to store final summary.

Canister contract (candid) updates:

- add update function: update_session_verification(sessionId, assetId, verificationSummary) -> icp cycles cost small; store summary fields only

## Frontend UX Changes

Pages / components:

- Session Gallery (new): show per-step thumbnails in order with per-step similarity values; highlight anomalies in red/yellow; show evidence and caption.
- Asset Delete: button per asset (backend call) with confirmation.
- Manual Verify Modal: reviewer can approve/reject/adjust score and add notes.
- NFT Details: show finalScore badge, breakdown accordion, and evidence thumbnails (link to S3 view).

Visual cues & guidance:

- Show progress bar for verification (pending, verified, review_needed).
- Offer tips for artisans to improve score (add intermediate steps, consistent tools/background, include PSD/layers, keep timestamps consistent).

## Incentives & Gamification (brief)

Untuk mendorong artisan meningkatkan score:

- Marketplace boost (sorting/visibility) untuk score >= thresholds.
- Badges / verified ribbon (on-chain or off-chain) untuk consistent high scorers.
- Reduced minting/listing fees atau akses fitur premium untuk high scores.
- Challenges & leaderboards.

## Security & Privacy

- Jangan simpan S3 credentials di client; gunakan presigned URLs.
- Hash (sha256) harus dihitung client-side dan divalidasi server-side.
- Hanya ringkasan hasil verifikasi yang disimpan on-chain.
- Rate-limit inference jobs & require authentication for manual verify.
- Data retention policy: tunggu kebijakan — saran: simpan evidence thumbnails 90 hari by default.

## Testing & QA

- Dev mode: gunakan deterministic stub worker yang men-generate predictable scores untuk UI development.
- Local testing: gunakan MinIO sebagai S3 mock.
- Collect human override events to build labeled dataset for future ML tuning.

## Milestones & Estimasi (MVP)

- M1 (2–3 hari): Backend: DB model + endpoints for asset upload record + delete + stub enqueue.
- M2 (3–5 hari): Worker PoC using OpenCLIP + BLIP (CPU) that computes embeddings & basic score; store summary.
- M3 (3 hari): Frontend gallery + NFT details view + manual verify modal (UI only) and integrate with backend stub.
- M4 (3–5 hari): Hook worker -> backend -> canister summary update; end-to-end flow.
- M5 (2–4 hari): Tuning thresholds, QA, monitoring, docs, rollout.

## Risks & Mitigations

- False positives: mitigated with human-in-loop & manual override.
- Performance/Cost: CPU inference ok for low volume; plan GPU for scale; queue jobs and rate-limit.
- Privacy: keep heavy assets off-chain; encrypt S3 if required.

## Next Steps (technical deliverables)

1. Implement backend endpoints and DB schema (M1).
2. Add worker PoC using OpenCLIP and output JSON summary (M2).
3. Create frontend skeleton for session gallery and manual verify (M3).
4. Integrate canister call for summary storage and add generate-candid step.

---

Dokumen ini dibuat dari diskusi tim dan bisa diperbarui setelah PoC dan pengumpulan data lapangan.
