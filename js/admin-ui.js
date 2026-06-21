// ===========================
// ADMIN UI MODULE
// ===========================

import AdminAuth from './admin-auth.js';
import AdminSettings from './admin-settings.js';
import AdminAnalytics from './admin-analytics.js';

/**
 * Admin UI handler
 */
export class AdminUI {
    constructor() {
        this.auth = new AdminAuth();
        this.settings = new AdminSettings();
        this.analytics = new AdminAnalytics();
        this.currentTab = 'dashboard';
    }

    /**
     * Show login panel
     */
    showLoginPanel() {
        const overlay = document.createElement('div');
        overlay.id = 'adminLoginOverlay';
        overlay.style.cssText = `
            position: fixed; inset: 0; background: rgba(0,0,0,0.7);
            display: flex; align-items: center; justify-content: center;
            z-index: 10000; font-family: inherit;
        `;

        overlay.innerHTML = `
            <div style="
                background: white; border-radius: 16px; padding: 2.5rem;
                width: 100%; max-width: 450px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            ">
                <h2 style="margin:0 0 1rem; color: #333; text-align: center;">🔐 Panel Administracyjny</h2>
                <p style="color:#666; font-size:0.9rem; margin:0 0 1.5rem; text-align: center;">
                    Zaloguj się aby zarządzać aplikacją
                </p>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display:block; font-weight:600; margin-bottom:0.4rem; color: #333;">Nazwa użytkownika</label>
                    <input id="adminUsername" type="text" placeholder="admin" style="
                        width: 100%; box-sizing: border-box; padding: 0.75rem;
                        border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;
                    ">
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display:block; font-weight:600; margin-bottom:0.4rem; color: #333;">Hasło</label>
                    <input id="adminPassword" type="password" placeholder="••••••••" style="
                        width: 100%; box-sizing: border-box; padding: 0.75rem;
                        border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;
                    ">
                </div>
                
                <div id="adminLoginError" style="color:#c0392b; font-size:0.85rem; min-height:1.2rem; margin-bottom:1rem; text-align: center;"></div>
                
                <button id="adminLoginBtn" style="
                    width: 100%; padding: 0.85rem; background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600;
                    cursor: pointer; transition: transform 0.2s;
                ">
                    Zaloguj się
                </button>
                
                <p style="font-size: 0.8rem; color: #999; margin-top: 1rem; text-align: center;">
                    Demo: admin / admin123
                </p>
            </div>
        `;

        document.body.appendChild(overlay);

        const loginBtn = document.getElementById('adminLoginBtn');
        const usernameInput = document.getElementById('adminUsername');
        const passwordInput = document.getElementById('adminPassword');
        const errorDiv = document.getElementById('adminLoginError');

        loginBtn.addEventListener('click', async () => {
            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            if (!username || !password) {
                errorDiv.textContent = 'Wpisz nazwę użytkownika i hasło';
                return;
            }

            loginBtn.disabled = true;
            loginBtn.textContent = 'Logowanie...';

            const success = await this.auth.login(username, password);
            
            if (success) {
                overlay.remove();
                this.showAdminPanel();
            } else {
                errorDiv.textContent = 'Błędna nazwa użytkownika lub hasło';
                loginBtn.disabled = false;
                loginBtn.textContent = 'Zaloguj się';
            }
        });

        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                loginBtn.click();
            }
        });
    }

    /**
     * Show admin panel
     */
    showAdminPanel() {
        const panel = document.createElement('div');
        panel.id = 'adminPanel';
        panel.style.cssText = `
            position: fixed; top: 0; right: 0; bottom: 0; left: 0;
            background: #f5f5f5; z-index: 10001;
            display: flex; flex-direction: column;
        `;

        const header = `
            <div style="
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white; padding: 1.5rem; display: flex; justify-content: space-between; align-items: center;
            ">
                <div>
                    <h1 style="margin: 0; font-size: 1.5rem;">⚙️ Panel Administracyjny</h1>
                    <p style="margin: 0.25rem 0 0; opacity: 0.9; font-size: 0.9rem;">Witaj, ${this.auth.getCurrentUser().username}</p>
                </div>
                <button id="adminLogoutBtn" style="
                    background: rgba(255,255,255,0.2); color: white; border: none;
                    padding: 0.6rem 1.2rem; border-radius: 6px; cursor: pointer; font-weight: 600;
                    transition: background 0.2s;
                ">
                    Wyloguj
                </button>
            </div>
        `;

        const nav = `
            <div style="
                background: white; display: flex; gap: 0; border-bottom: 2px solid #e0e0e0;
                overflow-x: auto;
            ">
                <button class="admin-tab" data-tab="dashboard" style="
                    padding: 1rem 1.5rem; border: none; background: none; cursor: pointer;
                    font-size: 1rem; color: #667eea; border-bottom: 3px solid #667eea; font-weight: 600;
                ">
                    📊 Pulpit
                </button>
                <button class="admin-tab" data-tab="settings" style="
                    padding: 1rem 1.5rem; border: none; background: none; cursor: pointer;
                    font-size: 1rem; color: #999;
                ">
                    ⚙️ Ustawienia
                </button>
                <button class="admin-tab" data-tab="features" style="
                    padding: 1rem 1.5rem; border: none; background: none; cursor: pointer;
                    font-size: 1rem; color: #999;
                ">
                    ✨ Funkcje
                </button>
                <button class="admin-tab" data-tab="maintenance" style="
                    padding: 1rem 1.5rem; border: none; background: none; cursor: pointer;
                    font-size: 1rem; color: #999;
                ">
                    🔧 Konserwacja
                </button>
            </div>
        `;

        const content = `
            <div id="adminPanelContent" style="flex: 1; overflow-y: auto; padding: 2rem;">
                <!-- Content will be loaded here -->
            </div>
        `;

        panel.innerHTML = header + nav + content;
        document.body.appendChild(panel);

        // Setup event listeners
        document.getElementById('adminLogoutBtn').addEventListener('click', () => {
            this.auth.logout();
            panel.remove();
        });

        document.querySelectorAll('.admin-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.admin-tab').forEach(b => {
                    b.style.color = '#999';
                    b.style.borderBottom = 'none';
                });
                e.target.style.color = '#667eea';
                e.target.style.borderBottom = '3px solid #667eea';
                this.currentTab = e.target.dataset.tab;
                this.loadTabContent(e.target.dataset.tab);
            });
        });

        this.loadTabContent('dashboard');
    }

    /**
     * Load tab content
     * @param {string} tab - Tab name
     */
    loadTabContent(tab) {
        const content = document.getElementById('adminPanelContent');
        
        switch(tab) {
            case 'dashboard':
                this.loadDashboard(content);
                break;
            case 'settings':
                this.loadSettings(content);
                break;
            case 'features':
                this.loadFeatures(content);
                break;
            case 'maintenance':
                this.loadMaintenance(content);
                break;
        }
    }

    /**
     * Load dashboard tab
     */
    loadDashboard(container) {
        const dashboard = this.analytics.getDashboardData();
        
        let html = '<h2 style="color: #333; margin-top: 0;">📊 Pulpit Nawigacyjny</h2>';
        html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">';
        
        dashboard.cards.forEach(card => {
            html += `
                <div style="
                    background: white; padding: 1.5rem; border-radius: 12px;
                    border-left: 4px solid ${card.color}; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                ">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">${card.icon}</div>
                    <h3 style="margin: 0 0 0.5rem; color: #666; font-size: 0.9rem;">${card.title}</h3>
                    <p style="margin: 0; font-size: 2rem; font-weight: 700; color: ${card.color};">${card.value}</p>
                </div>
            `;
        });
        
        html += '</div>';
        html += `
            <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <h3 style="margin-top: 0; color: #333;">📈 Statystyki</h3>
                <p style="margin: 0.5rem 0;"><strong>Najczęściej przeszukiwane miasto:</strong> ${dashboard.topCity}</p>
                <p style="margin: 0.5rem 0;"><strong>Najczęstsza pogoda:</strong> ${dashboard.mostCommonWeather}</p>
                <p style="margin: 0.5rem 0;"><strong>Średni czas odpowiedzi:</strong> ${dashboard.avgResponseTime}</p>
            </div>
        `;
        
        container.innerHTML = html;
    }

    /**
     * Load settings tab
     */
    loadSettings(container) {
        const allSettings = this.settings.getAllSettings();
        
        let html = '<h2 style="color: #333; margin-top: 0;">⚙️ Ustawienia Aplikacji</h2>';
        html += '<div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">';
        
        html += `
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: #333;">Nazwa aplikacji</label>
                <input type="text" value="${allSettings.appName}" style="
                    width: 100%; box-sizing: border-box; padding: 0.75rem;
                    border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;
                ">
            </div>
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: #333;">Wersja</label>
                <input type="text" value="${allSettings.appVersion}" disabled style="
                    width: 100%; box-sizing: border-box; padding: 0.75rem;
                    border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; background: #f5f5f5; color: #999;
                ">
            </div>
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: #333;">Limit historii</label>
                <input type="number" value="${allSettings.maxHistoryItems}" style="
                    width: 100%; box-sizing: border-box; padding: 0.75rem;
                    border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;
                ">
            </div>
            <div style="display: flex; gap: 1rem;">
                <button id="adminSaveSettingsBtn" style="
                    padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;
                    transition: transform 0.2s;
                ">
                    💾 Zapisz
                </button>
                <button id="adminResetSettingsBtn" style="
                    padding: 0.75rem 1.5rem; background: #f5f5f5; color: #333;
                    border: 2px solid #e0e0e0; border-radius: 8px; cursor: pointer; font-weight: 600;
                    transition: background 0.2s;
                ">
                    🔄 Resetuj
                </button>
            </div>
        `;
        
        html += '</div>';
        container.innerHTML = html;
    }

    /**
     * Load features tab
     */
    loadFeatures(container) {
        const features = this.settings.getAllSettings().enableFeatures;
        
        let html = '<h2 style="color: #333; margin-top: 0;">✨ Zarządzaj Funkcjami</h2>';
        html += '<div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">';
        
        const featureLabels = {
            darkMode: 'Tryb ciemny',
            history: 'Historia zapytań',
            quickButtons: 'Przyciski miast',
            recommendations: 'Rekomendacje ubioru',
            offline: 'Tryb offline'
        };
        
        Object.entries(features).forEach(([key, value]) => {
            html += `
                <div style="
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 1rem 0; border-bottom: 1px solid #e0e0e0;
                ">
                    <label style="color: #333; font-weight: 500;">${featureLabels[key]}</label>
                    <input type="checkbox" class="feature-toggle" data-feature="${key}" 
                        ${value ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;">
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
        document.querySelectorAll('.feature-toggle').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                this.settings.toggleFeature(e.target.dataset.feature);
            });
        });
    }

    /**
     * Load maintenance tab
     */
    loadMaintenance(container) {
        const settings = this.settings.getAllSettings();
        
        let html = '<h2 style="color: #333; margin-top: 0;">🔧 Konserwacja</h2>';
        html += '<div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">';
        
        html += `
            <div style="margin-bottom: 1.5rem; padding: 1rem; background: #fffacd; border-radius: 8px; border-left: 4px solid #ffa500;">
                <h3 style="margin-top: 0; color: #ff8c00;">⚠️ Tryb konserwacji</h3>
                <p style="margin: 0.5rem 0; color: #333;">
                    <input type="checkbox" id="maintenanceToggle" ${settings.maintenanceMode ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;">
                    <label for="maintenanceToggle" style="margin-left: 0.5rem; cursor: pointer;">Włącz tryb konserwacji</label>
                </p>
                <div style="margin-top: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: #333;">Wiadomość konserwacji</label>
                    <textarea id="maintenanceMsg" style="
                        width: 100%; box-sizing: border-box; padding: 0.75rem;
                        border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; min-height: 100px;
                    ">${settings.maintenanceMessage}</textarea>
                </div>
            </div>
            
            <div style="margin-bottom: 1.5rem; padding: 1rem; background: #f0f0f0; border-radius: 8px;">
                <h3 style="margin-top: 0; color: #333;">📊 Zarządzaj danymi</h3>
                <button id="adminExportStatsBtn" style="
                    padding: 0.75rem 1.5rem; background: #4facfe; color: white;
                    border: none; border-radius: 8px; cursor: pointer; font-weight: 600; margin-right: 1rem; margin-bottom: 1rem;
                ">
                    📥 Eksportuj statystyki
                </button>
                <button id="adminResetStatsBtn" style="
                    padding: 0.75rem 1.5rem; background: #c0392b; color: white;
                    border: none; border-radius: 8px; cursor: pointer; font-weight: 600; margin-bottom: 1rem;
                ">
                    🗑️ Resetuj statystyki
                </button>
            </div>
        `;
        
        html += '</div>';
        container.innerHTML = html;
        
        // Setup event listeners
        document.getElementById('maintenanceToggle').addEventListener('change', (e) => {
            this.settings.setMaintenanceMode(e.target.checked);
        });
        
        document.getElementById('adminExportStatsBtn').addEventListener('click', () => {
            const data = this.analytics.exportStats();
            this.downloadJSON(data, 'statistics.json');
        });
        
        document.getElementById('adminResetStatsBtn').addEventListener('click', () => {
            if (confirm('Czy na pewno chcesz zresetować wszystkie statystyki?')) {
                this.analytics.resetStats();
                alert('Statystyki zostały zresetowane');
                this.loadMaintenance(container);
            }
        });
    }

    /**
     * Download JSON file
     */
    downloadJSON(data, filename) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }
}

export default AdminUI;