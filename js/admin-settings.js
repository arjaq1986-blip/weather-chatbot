// ===========================
// ADMIN SETTINGS MODULE
// ===========================

/**
 * Admin settings and configuration handler
 */
export class AdminSettings {
    constructor() {
        this.SETTINGS_KEY = 'adminSettings';
        this.settings = this.loadSettings();
    }

    /**
     * Load settings from localStorage
     * @returns {Object} Settings object
     */
    loadSettings() {
        const saved = localStorage.getItem(this.SETTINGS_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            appName: 'Bot Doradzający Ubiór do Pogody',
            appVersion: '1.0.0',
            apiTimeout: 5000,
            maxHistoryItems: 20,
            enableNotifications: true,
            enableDarkMode: false,
            enableAnalytics: true,
            maintenanceMode: false,
            maintenanceMessage: 'Aplikacja jest w trybie konserwacji. Spróbuj później.',
            defaultLanguage: 'pl',
            cacheDuration: 3600000,
            enableFeatures: {
                darkMode: true,
                history: true,
                quickButtons: true,
                recommendations: true,
                offline: true
            },
            weatherApiKey: '',
            lastUpdated: new Date()
        };
    }

    /**
     * Save settings to localStorage
     */
    saveSettings() {
        this.settings.lastUpdated = new Date();
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.settings));
    }

    /**
     * Update a setting
     * @param {string} key - Setting key
     * @param {*} value - Setting value
     */
    updateSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
    }

    /**
     * Get a specific setting
     * @param {string} key - Setting key
     * @returns {*} Setting value
     */
    getSetting(key) {
        return this.settings[key];
    }

    /**
     * Get all settings
     * @returns {Object} All settings
     */
    getAllSettings() {
        return { ...this.settings };
    }

    /**
     * Toggle a feature
     * @param {string} featureName - Feature name
     */
    toggleFeature(featureName) {
        this.settings.enableFeatures[featureName] = 
            !this.settings.enableFeatures[featureName];
        this.saveSettings();
    }

    /**
     * Enable maintenance mode
     * @param {boolean} enabled - Enable or disable
     * @param {string} message - Maintenance message
     */
    setMaintenanceMode(enabled, message = '') {
        this.settings.maintenanceMode = enabled;
        if (message) {
            this.settings.maintenanceMessage = message;
        }
        this.saveSettings();
    }

    /**
     * Set API key
     * @param {string} apiKey - API key
     */
    setApiKey(apiKey) {
        this.settings.weatherApiKey = apiKey;
        this.saveSettings();
    }

    /**
     * Reset settings to defaults
     */
    resetToDefaults() {
        localStorage.removeItem(this.SETTINGS_KEY);
        this.settings = this.loadSettings();
    }

    /**
     * Export settings as JSON
     * @returns {string} JSON string
     */
    exportSettings() {
        return JSON.stringify(this.settings, null, 2);
    }
}

export default AdminSettings;