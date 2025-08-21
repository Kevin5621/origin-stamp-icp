# 📚 OriginStamp ICP Documentation

Welcome to the comprehensive documentation for OriginStamp ICP - a decentralized protocol for Proof of Human Process on the Internet Computer.

## 🎯 Quick Navigation

### 📖 [Project Overview](./01-project-overview.md)

High-level project description, goals, and vision for the Proof of Human Process protocol.

### 🚀 [Getting Started](./02-getting-started/)

- [Development Setup](./02-getting-started/01-development-setup.md) - Quick setup guide
- [Deployment Guide](./02-getting-started/02-deployment-guide.md) - Production deployment
- [Google OAuth Setup](./02-getting-started/03-google-oauth-setup.md) - Authentication configuration

### 🏗️ [Architecture & Design](./03-architecture/)

- [System Architecture](./03-architecture/01-system-architecture.md) - High-level system design
- [Frontend Architecture](./03-architecture/02-frontend-architecture.md) - React/TypeScript structure
- [Backend Architecture](./03-architecture/03-backend-architecture.md) - Rust/IC-CDK design

### 🎨 [Frontend Development](./04-frontend/)

- [UI Components](./04-frontend/01-ui-components.md) - Component library
- [CSS Architecture](./04-frontend/02-css-architecture.md) - ITCSS methodology
- [Component Guidelines](./04-frontend/03-component-guidelines.md) - CSS components guide
- [Icon Standards](./04-frontend/04-icon-standards.md) - Icon size and usage
- [Typography Guide](./04-frontend/05-typography-guide.md) - Font and text standards

### 🔧 [Backend Development](./05-backend/)

- [API Reference](./05-backend/01-api-reference.md) - Complete API documentation
- [User Management](./05-backend/02-user-management.md) - Authentication system
- [Physical Art Sessions](./05-backend/03-physical-art-sessions.md) - Session management
- [S3 Integration](./05-backend/04-s3-integration.md) - File storage system
- [ICRC-7 NFT Implementation](./05-backend/05-icrc7-nft-implementation.md) - NFT functionality

### 🔌 [Integration Guides](./06-integration/)

- [Frontend API Integration](./06-integration/01-frontend-api-integration.md) - Frontend-backend integration
- [S3 Setup Scripts](./06-integration/02-s3-setup-scripts.md) - S3 configuration automation

### 🧪 [Development Resources](./07-development/)

- [Development Guide](./07-development/01-development-guide.md) - Coding standards and best practices
- [Testing Strategy](./07-development/02-testing-strategy.md) - Testing approaches
- [Troubleshooting](./07-development/03-troubleshooting.md) - Common issues and solutions

## 🎯 Project Overview

OriginStamp ICP is a revolutionary decentralized protocol that addresses the fundamental crisis of trust in the digital creative economy. It provides a "Proof-of-Process" protocol that allows creators to generate unforgeable, on-chain histories for their work.

### Key Features

- ✅ **User Authentication** - Secure user registration and login
- ✅ **Physical Art Sessions** - Complete session management system
- ✅ **S3 File Storage** - Scalable file upload and management
- ✅ **ICRC-7 NFT Integration** - NFT minting from art sessions
- ✅ **Google OAuth** - Modern authentication integration
- ✅ **Comprehensive Testing** - Full test coverage
- ✅ **Production Ready** - Deployment and monitoring tools

## 🏗️ Technology Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for build tooling
- **ITCSS** for CSS architecture
- **React i18n** for internationalization

### Backend

- **Rust** with IC-CDK
- **Internet Computer Protocol**
- **Candid** for interface definitions

### Infrastructure

- **S3-Compatible Storage**
- **Google OAuth 2.0**
- **DFX** for development and deployment

## 🚀 Quick Start

```bash
# Clone repository
git clone <repository-url>
cd origin-stamp-icp

# Install dependencies
npm install

# Start development environment
npm run dev

# Deploy to local network
dfx deploy

# Setup S3 storage
./scripts/setup-s3.sh
```

## 📚 Documentation Philosophy

This documentation follows these principles:

- **Progressive Disclosure** - Start simple, dive deep when needed
- **Code Examples** - Every concept includes practical examples
- **Cross-References** - Easy navigation between related topics
- **Developer-First** - Written for developers, by developers
- **Maintained** - Regularly updated with code changes

## 🤝 Contributing

When contributing to documentation:

1. Follow the established folder structure
2. Use clear, descriptive file names
3. Include code examples
4. Cross-reference related documents
5. Update the navigation in this README

## 🔗 External Resources

- [GitHub Repository](https://github.com/Kevin5621/origin-stamp-icp)
- [Internet Computer Documentation](https://internetcomputer.org/docs)
- [Rust IC-CDK Documentation](https://docs.rs/ic-cdk)
- [React Documentation](https://react.dev)

---

_Last updated: December 2024_
