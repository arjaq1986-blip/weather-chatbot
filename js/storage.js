// ===========================
// STORAGE MODULE - LocalStorage Management
// ===========================

import { CONFIG } from './config.js';

/**
 * Saves chat message to LocalStorage
 * @param {Object} message - Message object {type, content, timestamp}
 */
export function saveChatMessage(message) {
    try {
        const history = getChatHistory();
        history.push({
            ...message,
            timestamp: new Date().toISOString()
        });

        // Keep only latest messages
        if (history.length > CONFIG.STORAGE.MAX_HISTORY) {
            history.shift();
        }

        localStorage.setItem(CONFIG.STORAGE.HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
        console.error('Error saving to LocalStorage:', error);
    }
}

/**
 * Retrieves chat history from LocalStorage
 * @returns {Array} Array of message objects
 */
export function getChatHistory() {
    try {
        const data = localStorage.getItem(CONFIG.STORAGE.HISTORY_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading from LocalStorage:', error);
        return [];
    }
}

/**
 * Clears entire chat history
 */
export function clearChatHistory() {
    try {
        localStorage.removeItem(CONFIG.STORAGE.HISTORY_KEY);
        console.log('Chat history cleared');
    } catch (error) {
        console.error('Error clearing history:', error);
    }
}

/**
 * Gets unique cities from history
 * @returns {Array} Array of unique city names
 */
export function getUniqueCitiesFromHistory() {
    try {
        const history = getChatHistory();
        const cities = new Set();

        history.forEach(msg => {
            if (msg.city) {
                cities.add(msg.city);
            }
        });

        return Array.from(cities).reverse().slice(0, 10);
    } catch (error) {
        console.error('Error getting cities from history:', error);
        return [];
    }
}

/**
 * Saves user preferences
 * @param {Object} preferences - User preferences object
 */
export function savePreferences(preferences) {
    try {
        localStorage.setItem(CONFIG.STORAGE.PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
        console.error('Error saving preferences:', error);
    }
}

/**
 * Retrieves user preferences
 * @returns {Object} Preferences object
 */
export function getPreferences() {
    try {
        const data = localStorage.getItem(CONFIG.STORAGE.PREFERENCES_KEY);
        return data ? JSON.parse(data) : {
            theme: 'light',
            language: 'pl',
            tempUnit: 'celsius'
        };
    } catch (error) {
        console.error('Error reading preferences:', error);
        return {};
    }
}