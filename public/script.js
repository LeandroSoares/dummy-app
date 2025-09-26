class CounterApp {
    constructor() {
        this.counterElement = document.getElementById('counter-value');
        this.incrementBtn = document.getElementById('increment-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.statusElement = document.getElementById('status');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadCounter();
        this.checkStatus();
        
        // Atualizar status a cada 30 segundos
        setInterval(() => this.checkStatus(), 30000);
    }
    
    bindEvents() {
        this.incrementBtn.addEventListener('click', () => this.incrementCounter());
        this.resetBtn.addEventListener('click', () => this.resetCounter());
    }
    
    async loadCounter() {
        try {
            const response = await fetch('/api/counter');
            const data = await response.json();
            this.updateCounterDisplay(data.counter);
        } catch (error) {
            console.error('Erro ao carregar contador:', error);
            this.updateStatus('Erro ao conectar', false);
        }
    }
    
    async incrementCounter() {
        this.setButtonsDisabled(true);
        
        try {
            const response = await fetch('/api/counter/increment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            this.updateCounterDisplay(data.counter);
            
            // Animação de incremento
            this.animateIncrement();
            
        } catch (error) {
            console.error('Erro ao incrementar contador:', error);
            this.updateStatus('Erro ao conectar', false);
        } finally {
            this.setButtonsDisabled(false);
        }
    }
    
    async resetCounter() {
        if (!confirm('Tem certeza que deseja resetar o contador?')) {
            return;
        }
        
        this.setButtonsDisabled(true);
        
        try {
            const response = await fetch('/api/counter/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            this.updateCounterDisplay(data.counter);
            
            // Animação de reset
            this.animateReset();
            
        } catch (error) {
            console.error('Erro ao resetar contador:', error);
            this.updateStatus('Erro ao conectar', false);
        } finally {
            this.setButtonsDisabled(false);
        }
    }
    
    async checkStatus() {
        try {
            const response = await fetch('/live');
            if (response.ok) {
                this.updateStatus('Online', true);
            } else {
                this.updateStatus('Offline', false);
            }
        } catch (error) {
            this.updateStatus('Offline', false);
        }
    }
    
    updateCounterDisplay(value) {
        this.counterElement.textContent = value;
    }
    
    updateStatus(message, isOnline) {
        this.statusElement.textContent = message;
        this.statusElement.className = `status ${isOnline ? 'online' : 'offline'}`;
    }
    
    setButtonsDisabled(disabled) {
        this.incrementBtn.disabled = disabled;
        this.resetBtn.disabled = disabled;
    }
    
    animateIncrement() {
        this.counterElement.style.transform = 'scale(1.2)';
        this.counterElement.style.color = '#38a169';
        
        setTimeout(() => {
            this.counterElement.style.transform = 'scale(1)';
            this.counterElement.style.color = '#667eea';
        }, 200);
    }
    
    animateReset() {
        this.counterElement.style.transform = 'scale(0.8)';
        this.counterElement.style.color = '#e53e3e';
        
        setTimeout(() => {
            this.counterElement.style.transform = 'scale(1)';
            this.counterElement.style.color = '#667eea';
        }, 200);
    }
}

// Inicializar a aplicação quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new CounterApp();
});
