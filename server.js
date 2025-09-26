const express = require('express');
const client = require('prom-client');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Configurar prometheus metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Métrica personalizada para o contador
const counter = new client.Counter({
  name: 'app_counter_total',
  help: 'Total number of counter increments',
  registers: [register]
});

// Estado do contador
let counterValue = 0;

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Rotas da API
app.get('/api/counter', (req, res) => {
  res.json({ counter: counterValue });
});

app.post('/api/counter/increment', (req, res) => {
  counterValue++;
  counter.inc();
  res.json({ counter: counterValue });
});

app.post('/api/counter/reset', (req, res) => {
  counterValue = 0;
  res.json({ counter: counterValue });
});

// Health checks
app.get('/live', (req, res) => {
  res.status(200).json({ status: 'alive', timestamp: new Date().toISOString() });
});

app.get('/ready', (req, res) => {
  res.status(200).json({ status: 'ready', timestamp: new Date().toISOString() });
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Dummy app running on port ${port}`);
  console.log(`Access the app at http://localhost:${port}`);
  console.log(`Health checks: /live and /ready`);
  console.log(`Metrics: /metrics`);
});
