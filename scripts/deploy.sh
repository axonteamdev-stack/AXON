#!/bin/bash
set -e

# AXON Deployment Script
# Usage: ./scripts/deploy.sh [backend|ai|all]

TARGET=${1:-all}

deploy_backend() {
    echo ">>> Deploying backend to Koyeb..."
    # koyeb service redeploy axon/backend
    echo "Backend deploy placeholder"
}

deploy_ai() {
    echo ">>> Deploying AI service..."
    # docker build -t axon-ai ./ai
    # docker push ...
    echo "AI deploy placeholder"
}

case $TARGET in
    backend) deploy_backend ;;
    ai) deploy_ai ;;
    all) deploy_backend && deploy_ai ;;
    *) echo "Usage: $0 [backend|ai|all]" && exit 1 ;;
esac
