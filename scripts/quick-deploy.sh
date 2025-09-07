#!/bin/bash

# Quick Deploy Script - Origin Stamp ICP with AI Verification
# Deploy backend canister and start frontend for testing

set -e

echo "🚀 Quick Deploy: Origin Stamp ICP + AI Verification"
echo "================================================="

# Check if dfx is running
if ! dfx ping > /dev/null 2>&1; then
    echo "📡 Starting dfx..."
    dfx start --background --clean
    sleep 5
fi

echo "🔧 Building backend canister..."
cd src/backend
cargo build --target wasm32-unknown-unknown --release

echo "🏗️ Building frontend..."
cd ../frontend
npm run build

echo "📦 Deploying backend canister..."
cd ../../
dfx deploy backend --mode reinstall

echo "🔑 Generating Candid interfaces..."
npm run generate-candid

echo "✅ Deployment complete!"
echo ""
echo "🌐 Available endpoints:"
echo "Frontend: http://localhost:3000"
echo "Backend Canister: $(dfx canister id backend)"
echo ""
echo "🧪 AI Verification Worker (local test):"
echo "cd services/ai-verification-worker"
echo "source venv/bin/activate"
echo "python3 simple_worker.py"
echo ""
echo "🎯 Next steps:"
echo "1. npm run dev (in src/frontend) - Start frontend"
echo "2. Test session creation and photo upload"
echo "3. Test AI verification UI (with mock results)"
echo "4. Get real Cerebras API key for production"
echo ""
