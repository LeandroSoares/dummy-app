#!/bin/bash

# Script para build e deploy da aplicação

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variáveis
IMAGE_NAME="dummy-app"
IMAGE_TAG="latest"
DOCKER_REGISTRY="${DOCKER_REGISTRY:-localhost:5000}"

echo -e "${GREEN}🚀 Iniciando build da Dummy App${NC}"

# Função para logging
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    error "Docker não está rodando!"
    exit 1
fi

# Build da imagem Docker
log "Building Docker image..."
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .

# Tag para registry se especificado
if [ "${DOCKER_REGISTRY}" != "localhost:5000" ]; then
    log "Tagging image for registry ${DOCKER_REGISTRY}..."
    docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
fi

# Push para registry (opcional)
if [ "$1" = "--push" ]; then
    log "Pushing image to registry..."
    docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
fi

# Deploy no Kubernetes (se kubectl estiver disponível)
if command -v kubectl &> /dev/null; then
    if [ "$1" = "--deploy" ] || [ "$2" = "--deploy" ]; then
        log "Deploying to Kubernetes..."
        kubectl apply -k k8s/
        log "Waiting for deployment to be ready..."
        kubectl wait --for=condition=available --timeout=300s deployment/dummy-app
        log "Deployment completed successfully!"
    fi
else
    warn "kubectl not found. Skipping Kubernetes deployment."
fi

log "Build completed successfully! 🎉"

echo ""
echo "Para testar localmente:"
echo "  docker run -p 3000:3000 ${IMAGE_NAME}:${IMAGE_TAG}"
echo ""
echo "Para fazer deploy no Kubernetes:"
echo "  kubectl apply -k k8s/"
