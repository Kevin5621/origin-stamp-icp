# Deployment Guide

## Overview

Panduan lengkap untuk deployment Origin Stamp ICP dari development hingga production environment.

## Prerequisites

### Software Requirements

- **DFX**: Internet Computer SDK v0.25.0+
- **Node.js**: v18+ dan npm
- **Rust**: Stable toolchain dengan wasm32-unknown-unknown target
- **Git**: Version control

### Installation

```bash
# Install DFX
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown

# Verify installations
dfx --version
node --version
cargo --version
```

## Project Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd origin-stamp-icp
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Rust dependencies (automatic during build)
cargo check
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit S3 credentials
nano .env
```

### Example .env Configuration

```bash
# DFX Configuration (auto-generated)
DFX_VERSION='0.25.0'
DFX_NETWORK='local'

# S3 Configuration
S3_ACCESS_KEY=your_access_key_here
S3_SECRET_KEY=your_secret_key_here
S3_REGION=ap-southeast-1
S3_ENDPOINT=https://s3.csalab.dev/
S3_BUCKET_NAME=assets
```

## Local Development

### 1. Start DFX Local Network

```bash
# Start local Internet Computer network
dfx start --clean --background

# Or with console output
dfx start --clean
```

### 2. Deploy Canisters

```bash
# Deploy both backend and frontend
dfx deploy

# Or deploy individually
dfx deploy backend
dfx deploy frontend
```

### 3. Setup S3 Configuration

> **Detail S3 Setup**: Untuk informasi lengkap tentang konfigurasi S3, lihat [`s3-integration.md`](./s3-integration.md)

```bash
# Automated S3 setup
./scripts/setup-s3.sh

# Or manual configuration
dfx canister call backend configure_s3 '(record {
    bucket_name="your-bucket";
    region="your-region";
    access_key_id="your-key";
    secret_access_key="your-secret";
    endpoint=opt "your-endpoint"
})'
```

### 4. Start Frontend Development Server

```bash
# Start Vite development server
npm start

# Or with specific port
npm run dev -- --port 3000
```

## Automated Deployment

### Using NPM Scripts

```bash
# Deploy everything with S3 setup
npm run deploy:with-s3

# Deploy without S3 setup
npm run deploy

# Setup S3 only
npm run setup:s3
```

### Custom Deployment Script

```bash
#!/bin/bash
# deploy-with-s3.sh

echo "=== Deploying Origin Stamp ICP ==="

# Start DFX if not running
if ! dfx ping > /dev/null 2>&1; then
    echo "Starting DFX..."
    dfx start --background
fi

# Deploy canisters
echo "Deploying canisters..."
dfx deploy

# Setup S3
if [ -f .env ]; then
    echo "Setting up S3 configuration..."
    ./scripts/setup-s3.sh
else
    echo "⚠️  .env file not found. Skipping S3 setup."
fi

echo "✅ Deployment complete!"

# Display URLs
echo ""
echo "=== Access URLs ==="
dfx canister id frontend | xargs -I {} echo "Frontend: http://{}.localhost:4943/"
dfx canister id backend | xargs -I {} echo "Backend Candid: http://127.0.0.1:4943/?canisterId=be2us-64aaa-aaaaa-qaabq-cai&id={}"
```

## Production Deployment

### 1. IC Mainnet Deployment

#### Setup Network

```bash
# Set network to mainnet
dfx deploy --network ic

# Or configure dfx.json for mainnet
{
  "networks": {
    "ic": {
      "providers": ["https://ic0.app"],
      "type": "persistent"
    }
  }
}
```

#### Deploy to Mainnet

```bash
# Deploy with cycles
dfx deploy --network ic --with-cycles 2000000000000

# Create canisters first (if needed)
dfx canister create --all --network ic
dfx build --all
dfx canister install --all --network ic
```

### 2. Custom IC Network

#### Configure Custom Network

```json
// dfx.json
{
  "networks": {
    "production": {
      "providers": ["https://your-ic-node.com"],
      "type": "persistent"
    }
  }
}
```

#### Deploy to Custom Network

```bash
dfx deploy --network production
```

## Environment-Specific Configuration

### Development

```bash
# .env.development
DFX_NETWORK=local
S3_ENDPOINT=https://localhost:9000  # MinIO local
DEBUG=true
```

### Staging

```bash
# .env.staging
DFX_NETWORK=testnet
S3_ENDPOINT=https://staging-s3.yourcompany.com
DEBUG=true
```

### Production

```bash
# .env.production
DFX_NETWORK=ic
S3_ENDPOINT=https://s3.amazonaws.com
DEBUG=false
```

## Canister Management

### Canister Status

```bash
# Check canister status
dfx canister status backend
dfx canister status frontend

# Get canister IDs
dfx canister id backend
dfx canister id frontend
```

### Canister Upgrades

```bash
# Upgrade backend (preserves state)
dfx build backend
dfx canister install backend --mode upgrade

# Reinstall (loses state)
dfx canister install backend --mode reinstall
```

### Canister Monitoring

```bash
# Monitor canister logs
dfx canister logs backend

# Real-time logs
dfx canister logs backend --follow
```

## Database Migration

### Session Data Migration

```rust
// Migration script example
#[ic_cdk::update]
fn migrate_sessions_v1_to_v2() -> u32 {
    let mut migrated_count = 0;

    PHYSICAL_ART_SESSIONS.with(|sessions| {
        let mut sessions_map = sessions.borrow_mut();

        for (id, session) in sessions_map.iter_mut() {
            // Add new fields if needed
            if session.status.is_empty() {
                session.status = "draft".to_string();
                migrated_count += 1;
            }
        }
    });

    migrated_count
}
```

### Data Backup

```bash
#!/bin/bash
# backup-data.sh

BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Export user data
dfx canister call backend get_all_users > "$BACKUP_DIR/users.txt"

# Export sessions (implement export function)
# dfx canister call backend export_sessions > "$BACKUP_DIR/sessions.json"

echo "Backup saved to $BACKUP_DIR"
```

## SSL/TLS Configuration

### Custom Domain Setup

```bash
# Configure custom domain for frontend canister
dfx canister update-settings frontend --add-controller <controller-principal>

# Setup DNS CNAME record
# your-domain.com -> <canister-id>.raw.ic0.app
```

### HTTPS Certificate

```nginx
# nginx.conf for reverse proxy
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://<canister-id>.localhost:4943;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Performance Optimization

### Frontend Optimization

```bash
# Build optimized frontend
npm run build:prod

# Analyze bundle size
npm run analyze

# Enable compression
dfx canister update-settings frontend --compute-allocation 1
```

### Backend Optimization

```toml
# Cargo.toml optimization
[profile.release]
lto = true
codegen-units = 1
panic = "abort"
strip = "symbols"
```

### Canister Settings

```bash
# Optimize canister settings
dfx canister update-settings backend --compute-allocation 10
dfx canister update-settings backend --memory-allocation 4GB
```

## Monitoring & Logging

### Application Monitoring

```bash
# Create monitoring script
#!/bin/bash
# monitor.sh

check_canister_health() {
    local canister=$1
    local status=$(dfx canister status $canister --network ic 2>/dev/null)

    if [[ $? -eq 0 ]]; then
        echo "✅ $canister: OK"
    else
        echo "❌ $canister: ERROR"
    fi
}

check_canister_health backend
check_canister_health frontend
```

### Error Tracking

```typescript
// Frontend error tracking
class ErrorTracker {
  static logError(error: Error, context: string) {
    console.error(`[${context}] ${error.message}`, error);

    // Send to monitoring service
    // this.sendToMonitoring(error, context);
  }
}
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to IC

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Setup Rust
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
          target: wasm32-unknown-unknown

      - name: Install DFX
        run: |
          wget https://github.com/dfinity/sdk/releases/download/0.15.0/dfx-0.15.0-x86_64-linux.tar.gz
          tar -xzf dfx-0.15.0-x86_64-linux.tar.gz
          sudo mv dfx /usr/local/bin/

      - name: Install dependencies
        run: npm ci

      - name: Deploy to IC
        env:
          DFX_IDENTITY: ${{ secrets.DFX_IDENTITY }}
          S3_ACCESS_KEY: ${{ secrets.S3_ACCESS_KEY }}
          S3_SECRET_KEY: ${{ secrets.S3_SECRET_KEY }}
        run: |
          echo "$DFX_IDENTITY" | base64 -d > identity.pem
          dfx identity import github-actions identity.pem
          dfx identity use github-actions
          npm run deploy:with-s3 -- --network ic
```

## Troubleshooting

### Common Issues

#### 1. DFX Connection Issues

```bash
# Problem: Can't connect to local network
# Solution: Restart DFX
dfx stop
dfx start --clean

# Problem: Port conflicts
# Solution: Use different port
dfx start --host 127.0.0.1:8001
```

#### 2. Build Failures

```bash
# Problem: Rust compilation errors
# Solution: Clean and rebuild
cargo clean
dfx build --check

# Problem: Frontend build issues
# Solution: Clear node modules
rm -rf node_modules
npm install
```

#### 3. Deployment Failures

```bash
# Problem: Out of cycles
# Solution: Add cycles to canister
dfx canister deposit-cycles 2000000000000 backend

# Problem: Canister full
# Solution: Increase memory allocation
dfx canister update-settings backend --memory-allocation 8GB
```

### Debug Mode

#### Enable Backend Debugging

```rust
#[cfg(feature = "debug")]
#[ic_cdk::update]
fn debug_info() -> String {
    format!(
        "Sessions: {}, Users: {}, S3 Status: {}",
        get_sessions_count(),
        get_user_count(),
        get_s3_config_status()
    )
}
```

#### Frontend Debug Mode

```typescript
// Enable debug logging
if (process.env.NODE_ENV === "development") {
  window.debugMode = true;
  console.log("Debug mode enabled");
}
```

## Health Checks

### Automated Health Check Script

```bash
#!/bin/bash
# health-check.sh

BACKEND_CANISTER_ID=$(dfx canister id backend)
FRONTEND_CANISTER_ID=$(dfx canister id frontend)

echo "=== Health Check ==="

# Check backend
echo "Checking backend..."
BACKEND_STATUS=$(dfx canister status $BACKEND_CANISTER_ID 2>/dev/null)
if [[ $? -eq 0 ]]; then
    echo "✅ Backend: Running"
else
    echo "❌ Backend: Down"
fi

# Check frontend
echo "Checking frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://$FRONTEND_CANISTER_ID.localhost:4943/")
if [[ $FRONTEND_STATUS -eq 200 ]]; then
    echo "✅ Frontend: Accessible"
else
    echo "❌ Frontend: Not accessible ($FRONTEND_STATUS)"
fi

# Check S3 config
echo "Checking S3 configuration..."
S3_STATUS=$(dfx canister call $BACKEND_CANISTER_ID get_s3_config_status)
if [[ $S3_STATUS == "(true)" ]]; then
    echo "✅ S3: Configured"
else
    echo "⚠️  S3: Not configured"
fi

echo "=== Health Check Complete ==="
```

## Backup & Recovery

### Data Backup Strategy

```bash
#!/bin/bash
# backup-strategy.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/$DATE"
mkdir -p "$BACKUP_DIR"

# Backup canister states
dfx canister status backend > "$BACKUP_DIR/backend_status.txt"
dfx canister status frontend > "$BACKUP_DIR/frontend_status.txt"

# Backup application data
dfx canister call backend get_all_users > "$BACKUP_DIR/users.txt"
# Add more data exports as needed

# Compress backup
tar -czf "backup_$DATE.tar.gz" "$BACKUP_DIR"
rm -rf "$BACKUP_DIR"

echo "Backup created: backup_$DATE.tar.gz"
```

### Recovery Process

```bash
#!/bin/bash
# recovery.sh

# 1. Stop services
dfx stop

# 2. Clean state
dfx start --clean

# 3. Deploy canisters
dfx deploy

# 4. Restore data (implement data import functions)
# dfx canister call backend import_users < users_backup.txt

# 5. Verify restoration
./health-check.sh
```

## Security Checklist

### Pre-deployment Security

- [ ] Remove debug functions from production
- [ ] Validate all input parameters
- [ ] Implement proper access controls
- [ ] Secure S3 credentials
- [ ] Enable HTTPS for custom domains
- [ ] Implement rate limiting
- [ ] Add input sanitization
- [ ] Configure proper CORS settings

### Post-deployment Security

- [ ] Monitor canister logs
- [ ] Regular security updates
- [ ] Access log review
- [ ] Vulnerability scanning
- [ ] Backup verification
- [ ] Incident response plan
