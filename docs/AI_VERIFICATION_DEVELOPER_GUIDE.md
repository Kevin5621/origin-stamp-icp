# AI Verification Service - Developer Guide

## Overview

The AI Verification Service validates the authenticity of art creation process photos using a hybrid AI approach:

- **Cerebras API** (Llama-4-Scout) for text analysis and reasoning
- **OpenCLIP** (local) for image embeddings and visual similarity

## Quick Start

### 1. Environment Setup

```bash
# Install Python dependencies
cd services/ai-verification-worker
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Set environment variables
export CEREBRAS_API_KEY="your_cerebras_api_key"
export CANISTER_CALLBACK_URL="http://localhost:8000"
```

### 2. Health Check

```bash
# Test service health
python3 test_e2e.py

# Quick worker test
python3 simple_worker.py
```

### 3. Integration with Start Script

The AI worker is automatically started with the main application:

```bash
./scripts/start.sh
```

## Architecture

### Service Flow

```
1. Frontend → Request Verification → Backend Canister
2. Backend Canister → Queue Job → AI Worker Service
3. AI Worker → Process Images → Generate Result
4. AI Worker → Callback → Backend Canister
5. Backend Canister → Store Result → Frontend Display
```

### File Structure

```
services/ai-verification-worker/
├── worker.py              # Main worker service
├── simple_worker.py       # Test version with mocks
├── test_e2e.py           # End-to-end test suite
├── requirements.txt       # Python dependencies
├── venv/                 # Virtual environment (auto-generated)
├── *.log                # Worker logs (auto-generated)
├── *.pid                # Process ID files (auto-generated)
└── temp/                # Temporary files (auto-generated)
```

## API Reference

### Worker Service Classes

#### `VerificationWorker`

Main worker service for processing verification requests.

```python
class VerificationWorker:
    def __init__(self, cerebras_api_key: str, canister_url: str)
    async def process_verification_job(self, job: VerificationJob) -> AIVerificationResult
```

#### `VerificationJob`

Data structure for verification requests.

```python
@dataclass
class VerificationJob:
    verification_id: str
    session_id: str
    assets: List[VerificationAsset]
```

#### `VerificationAsset`

Individual image asset for verification.

```python
@dataclass
class VerificationAsset:
    asset_id: str
    s3_url: str
    step_index: int
```

#### `AIVerificationResult`

Verification result structure.

```python
@dataclass
class AIVerificationResult:
    verification_id: str
    status: VerificationStatus  # Pending, Approved, ReviewNeeded, Rejected
    final_score: int           # 0-100
    breakdown: Dict[str, int]  # Score components
    anomaly_count: int
    evidence_urls: List[str]
    notes: List[str]
    processed_at: int
```

### Scoring Algorithm

```python
# Weighted scoring components
final_score = (
    visual_similarity * 0.3 +      # OpenCLIP image similarity
    process_consistency * 0.4 +    # Cerebras text analysis
    authenticity * 0.2 +          # Cerebras authenticity check
    process_quality * 0.1         # Cerebras quality assessment
)

# Status determination
if final_score >= 80:
    status = "Approved"
elif final_score >= 60:
    status = "ReviewNeeded"
else:
    status = "Rejected"
```

## Configuration

### Environment Variables

```bash
# Required
CEREBRAS_API_KEY=csk-your-api-key-here
CANISTER_CALLBACK_URL=http://localhost:8000

# Optional
WORKER_PORT=8001
LOG_LEVEL=INFO
MAX_CONCURRENT_JOBS=5
TEMP_DIR=./temp
```

### Cerebras API Configuration

```python
# API Limits (Free Tier)
MAX_TOKENS_PER_DAY = 1_000_000
MAX_REQUESTS_PER_MINUTE = 30
MODEL = "llama3.1-8b"

# Usage optimization
- Send only image captions to Cerebras (not raw images)
- Use local OpenCLIP for image processing
- Implement request batching for efficiency
```

## Testing

### Unit Tests

```bash
# Test individual components
python3 -c "from simple_worker import SimpleVerificationWorker; print('✅ Import OK')"

# Test mock analysis
python3 simple_worker.py
```

### Integration Tests

```bash
# End-to-end workflow test
python3 test_e2e.py

# Expected output:
# - Generate mock art sequences
# - Process with AI worker
# - Validate scoring logic
# - Check result format
```

### Health Check

```bash
# Verify environment setup
python3 -c "
import asyncio
from test_e2e import test_worker_health
asyncio.run(test_worker_health())
"
```

## Production Deployment

### Service Management

```bash
# Start worker service
cd services/ai-verification-worker
source venv/bin/activate
nohup python3 worker.py > worker.log 2>&1 &
echo $! > worker.pid

# Stop worker service
kill $(cat worker.pid)
rm worker.pid

# Check status
ps aux | grep worker.py
tail -f worker.log
```

### Monitoring

```bash
# Check worker logs
tail -f services/ai-verification-worker/worker.log

# Monitor process
watch "ps aux | grep worker.py"

# Check resource usage
htop -p $(cat services/ai-verification-worker/worker.pid)
```

### Error Handling

The worker includes comprehensive error handling:

- **API Rate Limits**: Automatic retry with exponential backoff
- **Network Errors**: Connection retry with timeout
- **Processing Errors**: Graceful failure with error logging
- **Memory Management**: Cleanup of temporary files

## Frontend Integration

### Service Layer

```typescript
// services/verificationService.ts
import { VerificationService } from "@/services/verificationService";

// Request verification
const verificationId =
  await VerificationService.createVerificationRequest(sessionId);

// Get result
const result = await VerificationService.getVerificationResult(sessionId);

// Manual override (admin)
await VerificationService.manualVerificationOverride(
  verificationId,
  "Approved",
  "Manual review complete",
);
```

### UI Components

```tsx
// components/verification/VerificationComponents.tsx
import {
  VerificationCard,
  VerificationBadge,
} from "@/components/verification/VerificationComponents";

<VerificationCard
  verification={result}
  loading={isLoading}
  onRequestVerification={handleRequest}
  showAdminControls={isAdmin}
/>;
```

## Backend Integration

### Canister Functions

```rust
// src/backend/src/modules/verification/mod.rs

// Request verification
create_verification_request(session_id: String) -> Result<String, String>

// Update result (worker callback)
update_verification_result(verification_id: String, result: AIVerificationResult) -> Result<(), String>

// Get result
get_verification_result(session_id: String) -> Option<AIVerificationResult>

// Admin functions
get_pending_verifications() -> Vec<AIVerificationResult>
manual_verification_override(verification_id: String, status: String, notes: String) -> Result<(), String>
```

## Troubleshooting

### Common Issues

#### Worker Won't Start

```bash
# Check Python environment
python3 --version
which python3

# Check dependencies
pip list | grep -E "(aiohttp|httpx|pillow)"

# Check environment variables
echo $CEREBRAS_API_KEY | cut -c1-8
echo $CANISTER_CALLBACK_URL
```

#### API Key Issues

```bash
# Test Cerebras API connection
curl -H "Authorization: Bearer $CEREBRAS_API_KEY" \
     https://api.cerebras.ai/v1/models
```

#### Import Errors

```bash
# Reinstall dependencies
pip install --force-reinstall -r requirements.txt

# Check virtual environment
which python3
which pip
```

#### Worker Process Issues

```bash
# Check if worker is running
ps aux | grep worker.py

# Check logs for errors
tail -20 services/ai-verification-worker/worker.log

# Restart worker
kill $(cat services/ai-verification-worker/worker.pid) 2>/dev/null
cd services/ai-verification-worker && source venv/bin/activate && python3 worker.py &
```

### Debug Mode

```bash
# Enable debug logging
export LOG_LEVEL=DEBUG
python3 worker.py

# Test with verbose output
python3 test_e2e.py --verbose
```

## Performance Optimization

### Resource Management

- **Memory**: Automatic cleanup of processed images
- **CPU**: Async processing for concurrent jobs
- **Network**: Connection pooling for API requests
- **Storage**: Temporary file rotation

### Scaling Considerations

- **Horizontal**: Multiple worker instances with load balancing
- **Vertical**: Increase worker resources for faster processing
- **Caching**: Cache image embeddings for repeated analysis
- **Batching**: Process multiple verifications together

---

## Quick Commands Reference

```bash
# Setup
cd services/ai-verification-worker && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt

# Test
python3 test_e2e.py

# Start
nohup python3 worker.py > worker.log 2>&1 & echo $! > worker.pid

# Monitor
tail -f worker.log

# Stop
kill $(cat worker.pid) && rm worker.pid
```
