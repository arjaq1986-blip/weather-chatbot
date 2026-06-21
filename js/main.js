// ===========================
// MAIN APPLICATION MODULE
// ===========================

import { CONFIG, QUICK_CITIES, ERROR_MESSAGES } from './config.js';
import { fetchWeatherData, parseWeatherData, getMockWeatherData } from './api.js';
import { getClothingByTemperature, generateWeatherAdvice, parseNaturalLanguageInput } from './weather-logic.js';
import { saveChatMessage, getChatHistory, clearChatHistory, getUniqueCitiesFromHistory } from './storage.js';
import { 
    initializeDOMElements, 
    displayUserMessage, 
    displayBotMessage,
    displayWeatherCard,
    displayRecommendations,
    showLoading,
    hideLoading,
    showError,
    clearUserInput,
    getElement,
    enableInput,
    disableInput,
    updateUserInput
} from './ui.js';

/**
 * Application State
 */
const appState = {
    apiKey: null,
    isLoading: false,
    currentWeatherData: null
};

/**
 * Initializes the application
 */
export function initializeApp() {
    console.log('🚀 Initializing Weather Chatbot...');
    
    // Initialize DOM
    initializeDOMElements();
    
    // Load API key from environment or session
    loadAPIKey();
    
    // Set up event listeners
    setupEventListeners();
    
    // Render quick city buttons
    renderQuickCityButtons();
    
    // Render history
    renderChatHistory();
    
    // Display welcome message
    displayWelcomeMessage();
    
    console.log('✅ Application initialized');
}

/**
 * Loads API key from environment or indexed DB
 * @private
 */
function loadAPIKey() {
    // Try to load from window.WEATHER_BOT_CONFIG (for production deployment)
    if (window.WEATHER_BOT_CONFIG && window.WEATHER_BOT_CONFIG.apiKey) {
        appState.apiKey = window.WEATHER_BOT_CONFIG.apiKey;
        console.log('✅ API Key loaded from config');
    } else {
        console.warn('⚠️ No API Key configured. Using mock data mode.');
    }
}

/**
 * Sets up all event listeners
 * @private
 */
function setupEventListeners() {
    const inputForm = getElement('inputForm');
    const quickButtons = getElement('quickButtons');
    const clearHistoryBtn = getElement('clearHistoryBtn');

    // Form submission
    if (inputForm) {
        inputForm.addEventListener('submit', handleUserInput);
    }

    // Quick city buttons
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', (e) => handleQuickCityClick(e));
    });

    // Clear history button
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', handleClearHistory);
    }
}

/**
 * Handles user input submission
 * @private
 */
async function handleUserInput(event) {
    event.preventDefault();
    
    const userInput = getElement('userInput');
    const message = userInput.value.trim();
    
    if (!message) return;
    
    // Display user message
    displayUserMessage(message);
    clearUserInput();
    
    // Save to history
    saveChatMessage({ type: 'user', content: message });
    
    // Show loading state
    showLoading();
    disableInput();
    
    try {
        // Try to extract city name or parse weather data
        const cityMatch = extractCityFromInput(message);
        
        if (cityMatch) {
            // User mentioned a city - fetch real weather
            await fetchAndRecommend(cityMatch);
        } else {
            // Parse natural language weather input
            await handleNaturalLanguageInput(message);
        }
    } catch (error) {
        console.error('Error processing user input:', error);
        const errorMsg = error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
        displayBotMessage(errorMsg, false);
        showError(errorMsg);
        saveChatMessage({ type: 'bot', content: errorMsg });
    } finally {
        hideLoading();
        enableInput();
    }
}

/**
 * Fetches weather and generates recommendations
 * @private
 */
async function fetchAndRecommend(city) {
    try {
        displayBotMessage(`🔍 Pobieram dane pogodowe dla ${city}...`, false);
        
        // Use mock data or real API
        let weatherData;
        if (appState.apiKey) {
            const rawData = await fetchWeatherData(city, appState.apiKey);
            weatherData = parseWeatherData(rawData);
        } else {
            // Use mock data
            const rawData = getMockWeatherData(city);
            weatherData = parseWeatherData(rawData);
        }
        
        appState.currentWeatherData = weatherData;
        
        // Display weather card
        displayWeatherCard(weatherData);
        
        // Generate recommendations
        const recommendation = generateWeatherAdvice(weatherData);
        displayRecommendations(recommendation);
        
        // Send friendly bot message
        const botMessage = `✅ Oto rekomendacje dla ${weatherData.city}! ${recommendation.emojis.join(' ')}`;
        displayBotMessage(botMessage, true);
        
        // Save to history
        saveChatMessage({
            type: 'bot',
            content: botMessage,
            city: weatherData.city,
            temperature: weatherData.temperature,
            recommendation: recommendation
        });
    } catch (error) {
        throw error;
    }
}

/**
 * Handles natural language weather input (without city)
 * @private
 */
async function handleNaturalLanguageInput(message) {
    const parsed = parseNaturalLanguageInput(message);
    
    if (!parsed.temperature) {
        const errorMsg = ERROR_MESSAGES.INVALID_TEMP;
        displayBotMessage(errorMsg, false);
        saveChatMessage({ type: 'bot', content: errorMsg });
        return;
    }
    
    // Create mock weather data from parsed input
    const mockWeatherData = {
        city: 'Twoja lokalizacja',
        country: 'PL',
        temperature: parsed.temperature,
        feelsLike: parsed.temperature,
        humidity: 60,
        pressure: 1013,
        windSpeed: parsed.hasWind ? 8 : 3,
        cloudiness: parsed.isSunny ? 10 : 60,
        description: buildWeatherDescription(parsed),
        main: buildWeatherMain(parsed),
        visibility: 10000,
        rainVolume: parsed.hasRain ? 2 : 0,
        snowVolume: parsed.hasSnow ? 1 : 0,
        sunrise: 0,
        sunset: 0
    };
    
    // Generate recommendations
    const recommendation = generateWeatherAdvice(mockWeatherData);
    displayWeatherCard(mockWeatherData);
    displayRecommendations(recommendation);
    
    const botMessage = `✅ Na podstawie opisanej pogody proponuję: ${recommendation.emojis.join(' ')}`;
    displayBotMessage(botMessage, true);
    saveChatMessage({ type: 'bot', content: botMessage });
}

/**
 * Extracts city name from user input
 * @private
 */
function extractCityFromInput(input) {
    const cityKeywords = ['pogoda', 'miasto', 'w', 'dla', 'kraków', 'warszawa', 'wrocław', 'gdańsk', 'poznań'];
    const lowerInput = input.toLowerCase();
    
    // Check for quick cities
    for (const city of QUICK_CITIES) {
        if (lowerInput.includes(city.name.toLowerCase())) {
            return city.name;
        }
    }
    
    // Try to extract capitalized city names
    const capitalizedWords = input.match(/\b[A-Z][a-ząćęłńóśźż]+\b/g);
    if (capitalizedWords && capitalizedWords.length > 0) {
        return capitalizedWords[0];
    }
    
    return null;
}

/**
 * Builds weather description from parsed data
 * @private
 */
function buildWeatherDescription(parsed) {
    let desc = [];
    if (parsed.isSunny) desc.push('słonecznie');
    if (parsed.isCloudy) desc.push('pochmurnie');
    if (parsed.hasRain) desc.push('pada deszcz');
    if (parsed.hasSnow) desc.push('pada śnieg');
    if (parsed.hasWind) desc.push('wietrzenie');
    if (parsed.isStorm) desc.push('burza');
    
    return desc.length > 0 ? desc.join(', ') : 'zmienna';
}

/**
 * Builds weather main condition from parsed data
 * @private
 */
function buildWeatherMain(parsed) {
    if (parsed.isStorm) return 'Thunderstorm';
    if (parsed.hasSnow) return 'Snow';
    if (parsed.hasRain) return 'Rain';
    if (parsed.isSunny) return 'Clear';
    if (parsed.isCloudy) return 'Clouds';
    return 'Clouds';
}

/**
 * Handles quick city button click
 * @private
 */
async function handleQuickCityClick(event) {
    const city = event.target.dataset.city;
    if (!city) return;
    
    updateUserInput(`Jaka pogoda w ${city}?`);
    const form = getElement('inputForm');
    if (form) form.dispatchEvent(new Event('submit'));
}

/**
 * Renders quick city buttons
 * @private
 */
function renderQuickCityButtons() {
    // Buttons are already in HTML, just add event listeners
    // They are handled in setupEventListeners
}

/**
 * Renders chat history from storage
 * @private
 */
function renderChatHistory() {
    const history = getChatHistory();
    const historyList = getElement('historyList');
    
    if (!historyList) return;
    
    const uniqueCities = getUniqueCitiesFromHistory();
    
    if (uniqueCities.length === 0) {
        historyList.innerHTML = '<p class="empty-history">Brak historii zapytań</p>';
        return;
    }
    
    historyList.innerHTML = uniqueCities
        .map(city => `
            <button class="history-item" onclick="window.handleHistoryClick('${city}')">
                📍 ${city}
            </button>
        `)
        .join('');
}

/**
 * Handles history item click
 * @private
 */
window.handleHistoryClick = function(city) {
    updateUserInput(`Pogoda w ${city}`);
    const form = getElement('inputForm');
    if (form) form.dispatchEvent(new Event('submit'));
};

/**
 * Handles clear history button click
 * @private
 */
function handleClearHistory() {
    if (confirm('Czy na pewno chcesz wyczyścić historię?')) {
        clearChatHistory();
        renderChatHistory();
        displayBotMessage('📊 Historia zapytań została wyczyszczona.', false);
    }
}

/**
 * Displays welcome message
 * @private
 */
function displayWelcomeMessage() {
    const welcomeMsg = `👋 Cześć! Jestem botem doradzającym ubiór do pogody.\n\nMogę Ci pomóc na kilka sposobów:\n1. Kliknij na szybkie przyciski miast poniżej\n2. Wpisz nazwę miasta (np. "Warszawa")\n3. Opisz pogodę (np. "Jest 15 stopni i pada deszcz")\n\nCo mogę dla Ciebie zrobić?`;
    displayBotMessage(welcomeMsg, false);
}

// ===========================
// APP START
// ===========================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}