// ===========================
// ADMIN AUTHENTICATION MODULE
// ===========================

/**
 * Admin authentication handler
 */
export class AdminAuth {
    constructor() {
        this.TOKEN_KEY = 'adminAuthToken';
        this.USER_KEY = 'adminUser';
        this.ADMIN_PASSWORD = 'admin123'; // In production, use backend authentication
        this.token = null;
        this.user = null;
        this.loadSession();
    }

    /**
     * Login with username and password
     * @param {string} username - Admin username
     * @param {string} password - Admin password
     * @returns {Promise<boolean>} True if login successful
     */
    async login(username, password) {
        // Simulate backend authentication
        return new Promise((resolve) => {
            setTimeout(() => {
                if (username === 'admin' && password === this.ADMIN_PASSWORD) {
                    this.token = this.generateToken();
                    this.user = {
                        id: 1,
                        username: username,
                        role: 'admin',
                        loginTime: new Date(),
                        lastActivity: new Date()
                    };
                    this.saveSession();
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 500);
        });
    }

    /**
     * Logout admin
     */
    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }

    /**
     * Check if admin is authenticated
     * @returns {boolean} True if authenticated
     */
    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    /**
     * Get current user
     * @returns {Object|null} Current user object
     */
    getCurrentUser() {
        return this.user;
    }

    /**
     * Generate authentication token
     * @returns {string} Authentication token
     */
    generateToken() {
        return 'admin_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    /**
     * Save session to localStorage
     */
    saveSession() {
        localStorage.setItem(this.TOKEN_KEY, this.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(this.user));
    }

    /**
     * Load session from localStorage
     */
    loadSession() {
        const token = localStorage.getItem(this.TOKEN_KEY);
        const user = localStorage.getItem(this.USER_KEY);
        
        if (token && user) {
            this.token = token;
            this.user = JSON.parse(user);
        }
    }
}

export default AdminAuth;
