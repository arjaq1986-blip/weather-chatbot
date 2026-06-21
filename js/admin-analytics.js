// ===========================
// ADMIN ANALYTICS MODULE
// ===========================

/**
 * Analytics and statistics handler
 */
export class AdminAnalytics {
    constructor() {
        this.STATS_KEY = 'adminStats';
        this.SESSIONS_KEY = 'userSessions';
        this.stats = this.loadStats();
    }

    /**
     * Load statistics from localStorage
     * @returns {Object} Statistics object
     */
    loadStats() {
        const saved = localStorage.getItem(this.STATS_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            totalQueries: 0,
            totalUsers: 0,
            totalSessions: 0,
            averageResponseTime: 0,
            topCities: {},
            weatherTypes: {},
            recommendationsGiven: 0,
            appInstalls: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }

    /**
     * Save statistics to localStorage
     */
    saveStats() {
        this.stats.updatedAt = new Date();
        localStorage.setItem(this.STATS_KEY, JSON.stringify(this.stats));
    }

    /**
     * Record a new query
     * @param {string} city - City name
     * @param {string} weatherType - Weather type
     * @param {number} responseTime - Response time in ms
     */
    recordQuery(city, weatherType, responseTime = 0) {
        this.stats.totalQueries++;
        this.stats.topCities[city] = (this.stats.topCities[city] || 0) + 1;
        this.stats.weatherTypes[weatherType] = (this.stats.weatherTypes[weatherType] || 0) + 1;
        this.stats.totalSessions++;
        
        if (this.stats.averageResponseTime === 0) {
            this.stats.averageResponseTime = responseTime;
        } else {
            this.stats.averageResponseTime = 
                (this.stats.averageResponseTime + responseTime) / 2;
        }
        
        this.saveStats();
    }

    /**
     * Record recommendation given
     */
    recordRecommendation() {
        this.stats.recommendationsGiven++;
        this.saveStats();
    }

    /**
     * Record app installation
     */
    recordInstall() {
        this.stats.appInstalls++;
        this.saveStats();
    }

    /**
     * Get statistics summary
     * @returns {Object} Statistics summary
     */
    getStatistics() {
        return {
            ...this.stats,
            topCity: Object.entries(this.stats.topCities)
                .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A',
            mostCommonWeather: Object.entries(this.stats.weatherTypes)
                .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
        };
    }

    /**
     * Get analytics for dashboard
     * @returns {Object} Dashboard analytics
     */
    getDashboardData() {
        const stats = this.getStatistics();
        return {
            cards: [
                {
                    title: 'Łączne Zapytania',
                    value: stats.totalQueries,
                    icon: '📊',
                    color: '#667eea'
                },
                {
                    title: 'Sesje Użytkowników',
                    value: stats.totalSessions,
                    icon: '👥',
                    color: '#764ba2'
                },
                {
                    title: 'Rekomendacje',
                    value: stats.recommendationsGiven,
                    icon: '👕',
                    color: '#f093fb'
                },
                {
                    title: 'Instalacje Aplikacji',
                    value: stats.appInstalls,
                    icon: '📱',
                    color: '#4facfe'
                }
            ],
            topCity: stats.topCity,
            mostCommonWeather: stats.mostCommonWeather,
            avgResponseTime: Math.round(stats.averageResponseTime) + 'ms'
        };
    }

    /**
     * Reset statistics
     */
    resetStats() {
        this.stats = {
            totalQueries: 0,
            totalUsers: 0,
            totalSessions: 0,
            averageResponseTime: 0,
            topCities: {},
            weatherTypes: {},
            recommendationsGiven: 0,
            appInstalls: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.saveStats();
    }

    /**
     * Export statistics as JSON
     * @returns {string} JSON string of statistics
     */
    exportStats() {
        return JSON.stringify(this.getStatistics(), null, 2);
    }
}

export default AdminAnalytics;
