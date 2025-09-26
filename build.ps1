# Script PowerShell para build e deploy da aplicação

param(
    [switch]$Push,
    [switch]$Deploy,
    [string]$Registry = "localhost:5000"
)

# Cores para output
$Green = [System.ConsoleColor]::Green
$Yellow = [System.ConsoleColor]::Yellow
$Red = [System.ConsoleColor]::Red

# Variáveis
$ImageName = "dummy-app"
$ImageTag = "latest"

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Green
}

function Write-Warn {
    param([string]$Message)
    Write-Host "[WARN] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

Write-Info "🚀 Iniciando build da Dummy App"

# Verificar se Docker está rodando
try {
    docker info | Out-Null
}
catch {
    Write-Error "Docker não está rodando!"
    exit 1
}

# Build da imagem Docker
Write-Info "Building Docker image..."
docker build -t "${ImageName}:${ImageTag}" .

if ($LASTEXITCODE -ne 0) {
    Write-Error "Falha no build da imagem Docker"
    exit 1
}

# Tag para registry se especificado
if ($Registry -ne "localhost:5000") {
    Write-Info "Tagging image for registry $Registry..."
    docker tag "${ImageName}:${ImageTag}" "${Registry}/${ImageName}:${ImageTag}"
}

# Push para registry (opcional)
if ($Push) {
    Write-Info "Pushing image to registry..."
    docker push "${Registry}/${ImageName}:${ImageTag}"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Falha no push da imagem"
        exit 1
    }
}

# Deploy no Kubernetes (se kubectl estiver disponível)
$kubectlAvailable = Get-Command kubectl -ErrorAction SilentlyContinue
if ($kubectlAvailable) {
    if ($Deploy) {
        Write-Info "Deploying to Kubernetes..."
        kubectl apply -k k8s/
        
        if ($LASTEXITCODE -eq 0) {
            Write-Info "Waiting for deployment to be ready..."
            kubectl wait --for=condition=available --timeout=300s deployment/dummy-app
            Write-Info "Deployment completed successfully!"
        }
        else {
            Write-Error "Falha no deploy do Kubernetes"
            exit 1
        }
    }
}
else {
    Write-Warn "kubectl not found. Skipping Kubernetes deployment."
}

Write-Info "Build completed successfully! 🎉"

Write-Host ""
Write-Host "Para testar localmente:"
Write-Host "  docker run -p 3000:3000 ${ImageName}:${ImageTag}"
Write-Host ""
Write-Host "Para fazer deploy no Kubernetes:"
Write-Host "  kubectl apply -k k8s/"
