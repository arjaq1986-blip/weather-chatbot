// ===========================
// CONFIGURATION MODULE
// ===========================

/**
 * API Configuration
 * Note: API Key should be set via environment variable or backend proxy
 * For production, use a backend server to hide the API key
 */
export const CONFIG = {
    API: {
        // Use backend proxy or environment variable
        BASE_URL: '/api/weather',
        DIRECT_URL: 'https://api.openweathermap.org/data/2.5/weather',
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
 * Clothing recommendations by temperature ranges
 */
export const CLOTHING_DATABASE = {
    veryHot: {
        temp: 30,
        clothing: ['Lekki T-shirt', 'Krótkie szorty', 'Sandały'],
        accessories: ['Kapelusz', 'Okulary słoneczne', 'Lekki szalik'],
        protection: ['Krem z SPF 50+', 'Butelka wody'],
        style: ['Minimalistyczne', 'Sportowe', 'Casual']
    },
    hot: {
        temp: 25,
        clothing: ['T-shirt', 'Krótkie spodnie', 'Trampki lub sandały'],
        accessories: ['Okulary słoneczne', 'Czapka baseballowa', 'Lekki szalik'],
        protection: ['Krem SPF 30+', 'Parasol'],
        style: ['Casual', 'Sportowe', 'Swobodne']
    },
    moderate: {
        temp: 15,
        clothing: ['Koszula', 'Jeansy', 'Sneakersy'],
        accessories: ['Lekka kurtka', 'Czapka', 'Szalik'],
        protection: ['Krem SPF 15+'],
        style: ['Eleganckie casual', 'Streetwear', 'Biznesowe']
    },
    cold: {
        temp: 5,
        clothing: ['Gruby sweter', 'Spodnie', 'Trapery'],
        accessories: ['Zimowa kurtka', 'Czapka zimowa', 'Szalik wełniany', 'Rękawiczki'],
        protection: ['Balsam do ust', 'Warstwowanie'],
        style: ['Ciepłe', 'Zimowe', 'Wygodne']
    },
    veryCold: {
        temp: 0,
        clothing: ['Długa termodzianka', 'Grube spodnie zimowe', 'Buty zimowe'],
        accessories: ['Parka', 'Czapka z futerkiem', 'Szal', 'Rękawiczki', 'Szalik'],
        protection: ['Warstwowanie ubrań', 'Krem na zmianę temperatury', 'Termalne skarpety'],
        style: ['Izolacyjne', 'Ciężkie', 'Ochronne']
    }
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
    API_ERROR: 'Nie udało się pobrać danych pogodowych. Sprawdź nazwę miasta.',
    NETWORK_ERROR: 'Problem z połączeniem internetowym.',
    INVALID_INPUT: 'Proszę wpisz ważne dane o pogodzie lub nazwę miasta.',
    UNKNOWN_ERROR: 'Nieznany błąd. Spróbuj jeszcze raz.',
    INVALID_TEMP: 'Nie mogę zidentyfikować temperatury. Spróbuj: "Jest 15 stopni i pada deszcz"'
};

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
    DATA_FETCHED: 'Pomyślnie pobrano dane pogodowe!',
    RECOMMENDATIONS_GENERATED: 'Rekomendacje zostały wygenerowane.'
};