# 🚀 Getting Started

Welcome to the getting started guide for OriginStamp ICP. This section will help you set up your development environment and deploy the application.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **DFX**: Internet Computer SDK v0.25.0+
- **Rust**: Stable toolchain with wasm32-unknown-unknown target
- **Git**: Latest version

## 📚 Quick Start Guide

### 1. [Development Setup](./01-development-setup.md)

Complete guide to set up your local development environment, including:

- Repository cloning and dependencies installation
- DFX local network configuration
- Development server setup
- Testing environment configuration

### 2. [Deployment Guide](./02-deployment-guide.md)

Comprehensive deployment guide covering:

- Local development deployment
- IC mainnet deployment
- Production environment configuration
- Monitoring and health checks
- Backup and recovery procedures

### 3. [Google OAuth Setup](./03-google-oauth-setup.md)

Step-by-step guide for configuring Google OAuth authentication:

- Google Cloud Console setup
- OAuth 2.0 client configuration
- Environment variable configuration
- Testing authentication flow

## 🎯 Development Workflow

```bash
# 1. Setup development environment
npm install
dfx start --clean

# 2. Deploy canisters
dfx deploy

# 3. Configure S3 storage
./scripts/setup-s3.sh

# 4. Start development server
npm start
```

## 🔧 Common Setup Issues

### DFX Connection Issues

```bash
# Restart DFX if connection fails
dfx stop
dfx start --clean
```

### Build Failures

```bash
# Clear and rebuild
cargo clean
dfx build --check
```

### S3 Configuration Issues

```bash
# Check S3 status
dfx canister call backend get_s3_config_status
```

## 📖 Next Steps

After completing the setup:

1. **Explore the Architecture** - Read the [Architecture & Design](../03-architecture/) section
2. **Frontend Development** - Check out [Frontend Development](../04-frontend/) guides
3. **Backend Development** - Review [Backend Development](../05-backend/) documentation
4. **Integration** - Learn about [Integration Guides](../06-integration/)

## 🆘 Need Help?

- Check the [Troubleshooting](../07-development/03-troubleshooting.md) guide
- Review common issues in the [Development Guide](../07-development/01-development-guide.md)
- Open an issue on the GitHub repository

---

_Ready to start building? Begin with the [Development Setup](./01-development-setup.md) guide!_
