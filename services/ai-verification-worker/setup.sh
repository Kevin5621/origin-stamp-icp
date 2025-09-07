#!/bin/bash

# AI Verification Worker Setup Script
# Sets up production-ready environment for Cerebras + OpenCLIP

set -e

echo "🚀 Setting up AI Verification Worker..."

# Check Python version
python_version=$(python3 --version 2>&1 | awk '{print $2}' | cut -d. -f1,2)
required_version="3.8"

if [ "$(printf '%s\n' "$required_version" "$python_version" | sort -V | head -n1)" != "$required_version" ]; then
    echo "❌ Python 3.8+ required. Found: $python_version"
    exit 1
fi

echo "✅ Python version check passed: $python_version"

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️ Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Download CLIP model (to cache it)
echo "🤖 Pre-downloading CLIP model..."
python3 -c "import clip; clip.load('ViT-B/32')" || echo "⚠️ CLIP download failed, will retry at runtime"

# Create environment file template
if [ ! -f ".env" ]; then
    echo "📝 Creating environment template..."
    cat > .env << EOF
# Cerebras API Configuration
CEREBRAS_API_KEY=your_cerebras_api_key_here

# Canister Configuration  
CANISTER_CALLBACK_URL=http://localhost:8000

# Worker Configuration
LOG_LEVEL=INFO
MAX_CONCURRENT_JOBS=3
VERIFICATION_TIMEOUT=300

# Model Configuration
CLIP_MODEL=ViT-B/32
SIMILARITY_THRESHOLD=0.55
ANOMALY_PENALTY=0.2

# Performance tuning
TORCH_DEVICE=cpu  # or cuda if available
BATCH_SIZE=1
EOF
    echo "📄 Created .env template - please configure your API keys"
fi

# Create systemd service file (optional)
cat > verification-worker.service << EOF
[Unit]
Description=AI Verification Worker for OriginStamp
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
Environment=PATH=$(pwd)/venv/bin
ExecStart=$(pwd)/venv/bin/python worker.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

echo "🎯 Installation complete!"
echo ""
echo "Next steps:"
echo "1. Configure your Cerebras API key in .env file"
echo "2. Test the worker: source venv/bin/activate && python worker.py"
echo "3. For production: sudo cp verification-worker.service /etc/systemd/system/"
echo ""
echo "💡 Free Cerebras tier limits: 1M tokens/day, 30 RPM"
echo "📊 Estimated capacity: ~100-500 verifications/day depending on image count"
