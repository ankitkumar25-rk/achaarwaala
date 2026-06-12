#!/bin/bash

# Exit on any error
set -e

echo "==========================================="
echo "  Valkey Local Setup Script for Ubuntu 24.04"
echo "==========================================="

echo "1. Updating APT repositories..."
sudo apt update

echo "2. Installing Valkey and Redis compatibility packages..."
sudo apt install -y valkey valkey-tools valkey-redis-compat

echo "3. Enabling and starting Valkey service..."
sudo systemctl enable valkey-server
sudo systemctl start valkey-server

echo "4. Checking Valkey status..."
sudo systemctl status valkey-server --no-pager

echo ""
echo "==========================================="
echo "✅ Valkey Setup Complete!"
echo "It is now running on localhost:6379"
echo "Your backend is already configured to use it via REDIS_URL=redis://localhost:6379"
echo "==========================================="
