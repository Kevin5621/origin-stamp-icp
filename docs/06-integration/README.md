# 🔌 Integration Guides

Welcome to the integration guides for OriginStamp ICP. This section covers how to integrate different components and services within the application.

## 📚 Integration Documentation

### 1. [Frontend API Integration](./01-frontend-api-integration.md)

Comprehensive guide for integrating frontend with backend APIs:

- Complete API function documentation
- TypeScript service layer patterns
- React component integration examples
- Error handling strategies
- Real-world usage scenarios

### 2. [S3 Setup Scripts](./02-s3-setup-scripts.md)

Automated S3 configuration and setup:

- Automated S3 configuration scripts
- Environment variable management
- Network-specific setup (local/IC mainnet)
- Troubleshooting and fixes
- Production deployment considerations

## 🎯 Integration Patterns

### Frontend-Backend Integration

```typescript
// Service layer pattern
export class PhysicalArtService {
  static async createSession(
    username: string,
    artTitle: string,
    description: string,
  ): Promise<string> {
    const result = await backend.create_physical_art_session(
      username,
      artTitle,
      description,
    );

    if ("Ok" in result) {
      return result.Ok;
    } else {
      throw new Error(result.Err);
    }
  }
}
```

### S3 Integration

```bash
# Automated S3 setup
./scripts/setup-s3.sh local

# Environment configuration
S3_ACCESS_KEY=your_key
S3_SECRET_KEY=your_secret
S3_REGION=ap-southeast-1
S3_BUCKET_NAME=your_bucket
```

## 🔧 Integration Workflows

### Complete Session Workflow

1. **User Authentication** → Frontend login with backend validation
2. **Session Creation** → Frontend form submission to backend
3. **File Upload** → S3 presigned URL generation and upload
4. **Session Management** → Frontend state management with backend sync
5. **NFT Minting** → Session completion with NFT generation

### Data Flow Architecture

```
Frontend (React)
    ↓ HTTP/Candid calls
Backend (Rust/IC-CDK)
    ↓ S3 API calls
S3 Storage
    ↓ NFT minting
ICRC-7 NFTs
```

## 🛠️ Integration Tools

### Development Tools

- **DFX**: Internet Computer development environment
- **Candid**: Interface definition language
- **TypeScript**: Generated types for type safety
- **React Hooks**: State management and API calls

### Testing Integration

```bash
# Test complete workflow
npm run test:integration

# Test API endpoints
dfx canister call backend test_api_endpoint

# Test S3 integration
./scripts/test-s3-integration.sh
```

## 📖 Best Practices

### API Integration

1. **Service Layer**: Abstract API calls in service classes
2. **Error Handling**: Consistent error patterns across frontend/backend
3. **Type Safety**: Use generated Candid types
4. **Loading States**: Implement proper loading indicators
5. **Caching**: Cache frequently accessed data

### S3 Integration

1. **Environment Variables**: Secure credential management
2. **Presigned URLs**: Use for secure direct uploads
3. **Error Recovery**: Handle upload failures gracefully
4. **Progress Tracking**: Show upload progress to users
5. **File Validation**: Validate file types and sizes

## 🔗 Related Documentation

- **[Frontend Development](../04-frontend/)** - Frontend implementation details
- **[Backend Development](../05-backend/)** - Backend API documentation
- **[Development Resources](../07-development/)** - Coding standards

## 🆘 Troubleshooting

### Common Integration Issues

#### API Connection Issues

```bash
# Check backend status
dfx canister status backend

# Test API connectivity
dfx canister call backend get_health_status
```

#### S3 Configuration Issues

```bash
# Verify S3 configuration
dfx canister call backend get_s3_config_status

# Reconfigure S3
./scripts/setup-s3.sh local
```

#### Type Generation Issues

```bash
# Regenerate Candid types
dfx generate

# Clear and rebuild
cargo clean && dfx build
```

---

_Ready to integrate components? Start with [Frontend API Integration](./01-frontend-api-integration.md)!_
