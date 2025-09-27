#!/bin/bash

# Sui Healthcare Contract Deployment Script
# This script deploys the healthcare smart contract to the Sui blockchain

set -e

echo "🏥 Deploying Healthcare Smart Contract to Sui Blockchain..."

# Check if Sui CLI is installed
if ! command -v sui &> /dev/null; then
    echo "❌ Sui CLI not found. Please install it first:"
    echo "   curl -fLJO https://github.com/MystenLabs/sui/releases/download/mainnet-v1.18.0/sui-mainnet-v1.18.0-ubuntu-x86_64.tgz"
    echo "   tar -xzf sui-mainnet-v1.18.0-ubuntu-x86_64.tgz"
    echo "   sudo mv sui /usr/local/bin/"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "contracts/healthcare.move" ]; then
    echo "❌ Healthcare contract not found. Please run this script from the project root."
    exit 1
fi

# Set network (default to testnet)
NETWORK=${1:-testnet}
echo "🌐 Deploying to: $NETWORK"

# Create a new Sui project if it doesn't exist
if [ ! -d "sui-healthcare" ]; then
    echo "📁 Creating new Sui project..."
    sui move new sui-healthcare
    cp contracts/healthcare.move sui-healthcare/sources/
fi

cd sui-healthcare

# Build the contract
echo "🔨 Building contract..."
sui move build

# Deploy the contract
echo "🚀 Deploying contract to $NETWORK..."
if [ "$NETWORK" = "testnet" ]; then
    sui client publish --gas-budget 100000000 --json > ../deployment-result.json
elif [ "$NETWORK" = "mainnet" ]; then
    echo "⚠️  WARNING: Deploying to MAINNET!"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        sui client publish --gas-budget 100000000 --json > ../deployment-result.json
    else
        echo "❌ Deployment cancelled."
        exit 1
    fi
else
    echo "❌ Invalid network. Use 'testnet' or 'mainnet'"
    exit 1
fi

# Extract package ID from deployment result
if [ -f "../deployment-result.json" ]; then
    PACKAGE_ID=$(cat ../deployment-result.json | jq -r '.objectChanges[] | select(.type == "published") | .packageId')
    echo "✅ Contract deployed successfully!"
    echo "📦 Package ID: $PACKAGE_ID"
    echo "🔗 Explorer: https://suiexplorer.com/object/$PACKAGE_ID?network=$NETWORK"
    
    # Update the package ID in the frontend
    echo "📝 Updating frontend configuration..."
    sed -i "s/PACKAGE_ID: '0x0'/PACKAGE_ID: '$PACKAGE_ID'/" ../src/lib/sui.ts
    
    echo "🎉 Deployment complete!"
    echo "💡 Don't forget to:"
    echo "   1. Update the PACKAGE_ID in src/lib/sui.ts"
    echo "   2. Create capabilities for institutions and doctors"
    echo "   3. Test the contract functions"
else
    echo "❌ Deployment failed. Check the error messages above."
    exit 1
fi

cd ..
