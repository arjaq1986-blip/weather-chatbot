// ===========================
// CONFIGURATION MODULE
// ===========================

/**
 * API Configuration
 * Note: API Key should be set via environment variable or backend proxy
 * For development, use a backend server to hide the API key
 */
export const CONFIG = {
    API: {
        // Use backend proxy instead of direct API calls
        BASE_URL: '/api/weather', // Backend endpoint
        TIMEOUT: 5000,
        RETRY_ATTEMPTS: 3
    },
    STORAGE: {
        HISTORY_KEY: 'weatherChatHistory',
        MAX_HISTORY: 20,
        PREFERENCES_KEY: 'weatherBotPreferences'
    },
    WEATHER: {
        TEMP_VERY_HOT: 30,
        TEMP_HOT: 25,
        TEMP_MODERATE: 15,
        TEMP_COLD: 5,
        TEMP_VERY_COLD: 0
    },
    UI: {
        ANIMATION_DURATION: 300,
        TYPING_SPEED: 50,
        MESSAGE_FADE_OUT: 5000
    }
};

/**
 * Quick buttons configuration
 */
export const QUICK_CITIES = [
    { name: 'Warszawa', emoji: '🏛️' },
    { name: 'Kraków', emoji: '⛰️' },
    { name: 'Wrocław', emoji: '🌉' },
    { name: 'Gdańsk', emoji: '⛵' },
    { name: 'Poznań', emoji: '🏰' }
];

/**
 * Natural Language Patterns for weather analysis
 */
export const WEATHER_PATTERNS = {
    temperature: /(\d+)\s*(?:stopni|°C|st|sg)/i,
    rain: /pada\s+deszcz|deszcz|pada|opady|mokro|przelotne|plucha|deszczowo/i,
    snow: /pada\s+śnieg|śnieg|zaspy|mróz|mrozi|zimno|śnieżnie/i,
    wind: /wiatr|wieje|silny\s+wiatr|porywy|wietrzenie/i,
    sunny: /słonecznie|słońce|bezchmurnie|czysto|pięknie|pogodnie/i,
    cloudy: /pochmurnie|chmury|chmurno|zachmurzenie|zachmurzone/i,
    humidity: /wilgotno|wilgotność/i,
    hot: /gorąco|upał|upal|wysoka\s+temperatura/i,
    cold: /zimno|chłodno|mróz|mrozi|przenikliwe|marzniecie/i,
    storm: /burza|grzmot|błyskawica|sztorm/i
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
    API_ERROR: 'Nie udało się pobrać danych pogodowych. Sprawdź nazwę miasta.',
    NETWORK_ERROR: 'Problem z połączeniem internetowym.',
    INVALID_INPUT: 'Proszę wpisz ważne dane o pogodzie lub nazwę miasta.',
    UNKNOWN_ERROR: 'Nieznany błąd. Spróbuj jeszcze raz.'
};

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
    DATA_FETCHED: 'Pomyślnie pobrano dane pogodowe!',
    RECOMMENDATIONS_GENERATED: 'Rekomendacje zostały wygenerowane.'
};
