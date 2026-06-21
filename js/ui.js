// ===========================
// UI MODULE - DOM Manipulation and Display
// ===========================

import { CONFIG } from './config.js';

/**
 * DOM Elements Cache
 */
let domElements = null;

/**
 * Initializes all DOM element references
 */
export function initializeDOMElements() {
    domElements = {
        chatContainer: document.getElementById('chatMessages'),
        userInput: document.getElementById('userInput'),
        inputForm: document.getElementById('inputForm'),
        sendButton: document.getElementById('sendButton'),
        loadingSpinner: document.getElementById('loadingSpinner'),
        errorToast: document.getElementById('errorToast'),
        weatherCard: document.getElementById('weatherCard'),
        recommendationsCard: document.getElementById('recommendationsCard'),
        clothingItems: document.getElementById('clothingItems'),
        recommendationText: document.getElementById('recommendationText'),
        quickButtons: document.querySelectorAll('.quick-btn'),
        historyList: document.getElementById('historyList'),
        clearHistoryBtn: document.getElementById('clearHistoryBtn'),
        tempDisplay: document.getElementById('tempDisplay')
    };
    return domElements;
}

/**
 * Gets cached DOM element
 * @param {string} elementId - Element ID or key
 */
export function getElement(elementId) {
    if (!domElements) {
        initializeDOMElements();
    }
    return domElements[elementId];
}

/**
 * Displays user message in chat
 * @param {string} message - Message text
 */
export function displayUserMessage(message) {
    const chatContainer = getElement('chatContainer');
    const messageDiv = createMessageElement('user', message);
    chatContainer.appendChild(messageDiv);
    scrollToBottom();
}

/**
 * Displays bot message in chat with typing animation
 * @param {string} message - Message text
 * @param {boolean} animate - Whether to animate typing
 */
export function displayBotMessage(message, animate = true) {
    const chatContainer = getElement('chatContainer');
    const messageDiv = createMessageElement('bot', '');
    chatContainer.appendChild(messageDiv);

    if (animate) {
        typeMessage(messageDiv.querySelector('.message-content'), message);
    } else {
        messageDiv.querySelector('.message-content').textContent = message;
    }
    
    scrollToBottom();
}

/**
 * Creates a message element for chat
 * @private
 */
function createMessageElement(type, content) {
    const div = document.createElement('div');
    div.className = `message ${type}-message`;
    div.innerHTML = `
        <div class="message-content">${escapeHTML(content)}</div>
        <span class="message-time">${new Date().toLocaleTimeString('pl-PL', {
            hour: '2-digit',
            minute: '2-digit'
        })}</span>
    `;
    return div;
}

/**
 * Types message character by character (typing animation)
 * @private
 */
function typeMessage(element, text) {
    let index = 0;
    element.textContent = '';
    
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, CONFIG.UI.TYPING_SPEED);
        }
    }
    type();
}

/**
 * Displays weather information card
 * @param {Object} weatherData - Weather data object
 */
export function displayWeatherCard(weatherData) {
    const card = getElement('weatherCard');
    if (!card) return;

    card.innerHTML = `
        <div class="weather-header">
            <h2>${weatherData.city}, ${weatherData.country}</h2>
            <div class="weather-icon">
                <span id="weatherEmoji">${getWeatherEmoji(weatherData.main)}</span>
            </div>
        </div>
        <div class="weather-main">
            <div class="temp-display">
                <span class="temperature">${weatherData.temperature}°C</span>
                <span class="feels-like">Odczuwalna: ${weatherData.feelsLike}°C</span>
            </div>
            <div class="weather-description">${weatherData.description}</div>
        </div>
        <div class="weather-details">
            <div class="detail">
                <span class="label">💧 Wilgotność</span>
                <span class="value">${weatherData.humidity}%</span>
            </div>
            <div class="detail">
                <span class="label">💨 Wiatr</span>
                <span class="value">${weatherData.windSpeed} km/h</span>
            </div>
            <div class="detail">
                <span class="label">👁️ Widoczność</span>
                <span class="value">${(weatherData.visibility / 1000).toFixed(1)} km</span>
            </div>
            <div class="detail">
                <span class="label">🎯 Ciśnienie</span>
                <span class="value">${weatherData.pressure} hPa</span>
            </div>
        </div>
    `;
    card.style.display = 'block';
}

/**
 * Displays clothing recommendations
 * @param {Object} recommendation - Recommendation object
 */
export function displayRecommendations(recommendation) {
    const container = getElement('recommendationsCard');
    if (!container) return;

    let html = `
        <div class="recommendation-header">
            <h3>👕 Rekomendacje dla Ciebie</h3>
            <div class="emoji-tags">${recommendation.emojis.map(e => `<span>${e}</span>`).join('')}</div>
        </div>
        <div class="recommendation-sections">
            <section class="rec-section">
                <h4>👔 Odzież</h4>
                <ul class="clothing-list">
                    ${recommendation.clothing.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </section>
            <section class="rec-section">
                <h4>🎒 Akcesoria</h4>
                <ul class="accessories-list">
                    ${recommendation.accessories.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </section>
            <section class="rec-section">
                <h4>🛡️ Ochrona</h4>
                <ul class="protection-list">
                    ${recommendation.protection.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </section>
            <section class="rec-section">
                <h4>🎨 Styl</h4>
                <div class="style-tags">
                    ${recommendation.style.map(style => `<span class="style-tag">${style}</span>`).join('')}
                </div>
            </section>
    `;

    if (recommendation.warnings.length > 0) {
        html += `
            <section class="rec-section warnings">
                <h4>⚠️ Ważne Uwagi</h4>
                <ul>
                    ${recommendation.warnings.map(w => `<li>${w}</li>`).join('')}
                </ul>
            </section>
        `;
    }

    html += `
            <section class="rec-section">
                <h4>💡 Porady</h4>
                <ul>
                    ${recommendation.advice.map(a => `<li>${a}</li>`).join('')}
                </ul>
            </section>
        </div>
    `;

    container.innerHTML = html;
    container.style.display = 'block';
}

/**
 * Shows loading spinner
 */
export function showLoading() {
    const spinner = getElement('loadingSpinner');
    if (spinner) spinner.style.display = 'block';
}

/**
 * Hides loading spinner
 */
export function hideLoading() {
    const spinner = getElement('loadingSpinner');
    if (spinner) spinner.style.display = 'none';
}

/**
 * Shows error toast notification
 * @param {string} message - Error message
 * @param {number} duration - Display duration in ms
 */
export function showError(message, duration = 5000) {
    const toast = getElement('errorToast');
    if (!toast) return;

    toast.textContent = message;
    toast.style.display = 'block';
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.style.display = 'none';
        }, CONFIG.UI.ANIMATION_DURATION);
    }, duration);
}

/**
 * Updates chat input field
 * @param {string} value - New value
 */
export function updateUserInput(value) {
    const input = getElement('userInput');
    if (input) input.value = value;
}

/**
 * Clears chat input field
 */
export function clearUserInput() {
    const input = getElement('userInput');
    if (input) input.value = '';
}

/**
 * Scrolls chat to bottom
 * @private
 */
function scrollToBottom() {
    const container = getElement('chatContainer');
    if (container) {
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, CONFIG.UI.TYPING_SPEED * 2);
    }
}

/**
 * Gets emoji for weather condition
 * @private
 */
function getWeatherEmoji(condition) {
    const emojiMap = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Mist': '🌫️',
        'Smoke': '💨',
        'Haze': '🌫️',
        'Dust': '🌪️',
        'Fog': '🌫️',
        'Sand': '🏜️',
        'Ash': '🌋',
        'Squall': '🌪️',
        'Tornado': '🌪️'
    };
    return emojiMap[condition] || '🌍';
}

/**
 * Escapes HTML special characters to prevent XSS
 * @private
 */
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Disables input form during loading
 */
export function disableInput() {
    const form = getElement('inputForm');
    const button = getElement('sendButton');
    if (form) form.style.pointerEvents = 'none';
    if (button) button.disabled = true;
}

/**
 * Enables input form after loading
 */
export function enableInput() {
    const form = getElement('inputForm');
    const button = getElement('sendButton');
    if (form) form.style.pointerEvents = 'auto';
    if (button) button.disabled = false;
}