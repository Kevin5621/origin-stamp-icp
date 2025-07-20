# Origin Stamp ICP - Documentation

## Overview

Origin Stamp ICP adalah aplikasi berbasis Internet Computer Protocol (ICP) yang menyediakan sistem manajemen pengguna dan physical art session dengan integrasi S3 storage untuk upload foto.

## Documentation Structure

### Core Documentation

- [`project-overview.md`](./project-overview.md) - Overview dan arsitektur proyek
- [`api-reference.md`](./api-reference.md) - Dokumentasi lengkap API Backend

### Feature Guides

- [`user-management.md`](./user-management.md) - Sistem manajemen pengguna
- [`physical-art-sessions.md`](./physical-art-sessions.md) - Manajemen physical art sessions
- [`s3-integration.md`](./s3-integration.md) - Integrasi S3 storage

### Development & Deployment

- [`development/development-setup.md`](./development/development-setup.md) - Quick setup untuk development
- [`development-guide.md`](./development-guide.md) - Standards, testing, dan best practices
- [`deployment-guide.md`](./deployment-guide.md) - Panduan deployment lengkap

### UI Components

- [`frontend/ui-components.md`](./frontend/ui-components.md) - Dokumentasi komponen UI

## Quick Start

### Prerequisites

- DFX (Internet Computer SDK)
- Node.js dan npm
- Rust toolchain

### Installation

```bash
# Clone repository
git clone <repository-url>
cd origin-stamp-icp

# Install dependencies
npm install

# Deploy canisters
dfx deploy

# Setup S3 (optional)
./scripts/setup-s3.sh
```

### Usage

- Frontend: `http://localhost:5173` (development) atau canister URL setelah deploy
- Admin Panel: `<frontend-url>/admin`
- Backend Candid Interface: Tersedia melalui DFX

## Architecture

```
Frontend (React/TypeScript)
    ↓ Candid/HTTP calls
Backend (Rust/IC-CDK)
    ↓ S3 API calls
S3 Storage
```

## Key Features

- ✅ User registration dan authentication
- ✅ Physical art session management
- ✅ S3 file upload integration
- ✅ Admin panel untuk konfigurasi
- ✅ Comprehensive testing suite

## Support

Untuk pertanyaan atau issues, silakan buka issue di repository atau lihat dokumentasi detail di folder docs.
