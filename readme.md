# Dummy App 🎯

## Description
This is a dummy app for testing purposes.
Ele tem como objetivo fornecer uma estrutura básica para desenvolvimento e testes.
É um micro site em nodejs que tem um botão de contador.
Ele expoe o contador via API REST.
Ele tem um front com um botão que incrementa o contador.
Ele expoe o contador no /metrics.
ele expoe o /live e o /ready para health checks.

Este projeto tem os codigos fonte para criar uma imagem docker e um kustomize para deploy no kubernetes.

## Features ✨

- 🖱️ Interface web interativa com contador
- 🔗 API REST para gerenciar o contador
- 📊 Métricas Prometheus no endpoint `/metrics`
- 🏥 Health checks nos endpoints `/live` e `/ready`
- 🐳 Docker container pronto para produção
- ☸️ Manifests Kubernetes com Kustomize
- 🔒 Configurações de segurança aplicadas

## Endpoints

### Web Interface
- `GET /` - Interface web principal

### API REST
- `GET /api/counter` - Obter valor atual do contador
- `POST /api/counter/increment` - Incrementar contador
- `POST /api/counter/reset` - Resetar contador para zero

### Monitoring & Health
- `GET /metrics` - Métricas Prometheus
- `GET /live` - Liveness probe (indica se a aplicação está rodando)
- `GET /ready` - Readiness probe (indica se a aplicação está pronta para receber tráfego)

## Quick Start 🚀

### Desenvolvimento Local

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em modo desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Executar em modo produção:**
   ```bash
   npm start
   ```

4. **Acessar a aplicação:**
   - Interface web: http://localhost:3000
   - API: http://localhost:3000/api/counter
   - Métricas: http://localhost:3000/metrics

### Docker 🐳

1. **Build da imagem:**
   ```bash
   docker build -t dummy-app .
   ```

2. **Executar container:**
   ```bash
   docker run -p 3000:3000 dummy-app
   ```

3. **Usando script de build (Linux/Mac):**
   ```bash
   chmod +x build.sh
   ./build.sh --push --deploy
   ```

4. **Usando script de build (Windows PowerShell):**
   ```powershell
   .\build.ps1 -Push -Deploy
   ```

### Kubernetes ☸️

1. **Deploy usando Kustomize:**
   ```bash
   kubectl apply -k k8s/
   ```

2. **Verificar status do deployment:**
   ```bash
   kubectl get pods -l app=dummy-app
   kubectl get svc dummy-app-service
   ```

3. **Acessar logs:**
   ```bash
   kubectl logs -l app=dummy-app -f
   ```

## Estrutura do Projeto 📁

```
dummy-app/
├── public/              # Arquivos estáticos do frontend
│   ├── index.html      # Interface web principal
│   ├── style.css       # Estilos CSS
│   └── script.js       # JavaScript do frontend
├── k8s/                # Manifests Kubernetes
│   ├── kustomization.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml
├── server.js           # Servidor Node.js principal
├── package.json        # Dependências e scripts npm
├── Dockerfile          # Container Docker
├── .dockerignore       # Arquivos ignorados no build Docker
├── build.sh           # Script de build para Linux/Mac
├── build.ps1          # Script de build para Windows
└── README.md          # Este arquivo
```

## Tecnologias Utilizadas 🛠️

- **Runtime:** Node.js 18
- **Framework:** Express.js
- **Métricas:** Prometheus (prom-client)
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Container:** Docker
- **Orquestração:** Kubernetes + Kustomize
- **Health Checks:** Express middleware

## Configurações de Segurança 🔒

- Container executa com usuário não-root
- Filesystem read-only no container
- Security contexts configurados no Kubernetes
- Health checks configurados
- Resource limits definidos

## Monitoramento 📊

A aplicação expõe métricas Prometheus no endpoint `/metrics`, incluindo:
- Métricas padrão do Node.js
- Contador customizado `app_counter_total`
- Métricas de HTTP requests (via Express)