#!/bin/bash

# Check if candid-extractor is installed
if ! command -v candid-extractor &> /dev/null; then
    echo "candid-extractor not found. Installing..."
    cargo install candid-extractor
    
    # Verify installation was successful
    if [ $? -ne 0 ]; then
        echo "Error: Failed to install candid-extractor"
        exit 1
    fi
    echo "candid-extractor installed successfully"
else
    echo "candid-extractor is already installed"
fi

CANISTER_NAME="vibe_coding_template"

# Build the Wasm module
cargo build --release --target wasm32-unknown-unknown --package "${CANISTER_NAME}_backend"

# Extract the Candid interface
candid-extractor "target/wasm32-unknown-unknown/release/${CANISTER_NAME}_backend.wasm" > "src/${CANISTER_NAME}_backend/${CANISTER_NAME}_backend.did"

echo "Candid interface generated successfully for ${CANISTER_NAME}"