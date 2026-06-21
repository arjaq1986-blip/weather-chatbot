// ===========================
// API MODULE - Weather Data Fetching
// ===========================

import { CONFIG, ERROR_MESSAGES } from './config.js';

/**
 * Fetches weather data from OpenWeatherMap API
 * @param {string} city - City name
 * @param {string} apiKey - OpenWeatherMap API key (from environment or backend)
 * @returns {Promise<Object>} Weather data object
 */
export async function fetchWeatherData(city, apiKey = null) {
    try {
        // Priority 1: Use backend proxy (recommended for production)
        try {
            return await fetchFromBackend(city);
        } catch (error) {
            console.warn('Backend proxy unavailable, falling back to direct API', error);
        }
        
        // Priority 2: Use direct API with provided key
        if (apiKey) {
            return await fetchFromDirectAPI(city, apiKey);
        }
        
        // No API key available
        throw new Error('API key not available. Use backend proxy or set API key.');
    } catch (error) {
        console.error('Weather API Error:', error);
        throw error;
    }
}

/**
 * Fetches weather data from backend proxy
 * @private
 */
async function fetchFromBackend(city) {
    const response = await Promise.race([
        fetch(`${CONFIG.API.BASE_URL}?city=${encodeURIComponent(city)}`),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), CONFIG.API.TIMEOUT)
        )
    ]);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${ERROR_MESSAGES.API_ERROR}`);
    }

    return await response.json();
}

/**
 * Fetches weather data directly from OpenWeatherMap API
 * WARNING: Only for development. Use backend proxy in production.
 * @private
 */
async function fetchFromDirectAPI(city, apiKey) {
    const url = `${CONFIG.API.DIRECT_URL}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=pl`;
    
    const response = await Promise.race([
        fetch(url),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), CONFIG.API.TIMEOUT)
        )
    ]);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || ERROR_MESSAGES.API_ERROR);
    }

    return await response.json();
}

/**
 * Parses raw weather data into unified format
 * @param {Object} rawData - Raw data from API
 * @returns {Object} Parsed weather object
 */
export function parseWeatherData(rawData) {
    return {
        city: rawData.name || 'Nieznane',
        country: rawData.sys?.country || '',
        temperature: Math.round(rawData.main?.temp || 0),
        feelsLike: Math.round(rawData.main?.feels_like || 0),
        humidity: rawData.main?.humidity || 0,
        pressure: rawData.main?.pressure || 0,
        windSpeed: Math.round(rawData.wind?.speed || 0),
        cloudiness: rawData.clouds?.all || 0,
        description: rawData.weather?.[0]?.description || '',
        main: rawData.weather?.[0]?.main || '',
        icon: rawData.weather?.[0]?.icon || '',
        visibility: rawData.visibility || 10000,
        rainVolume: rawData.rain?.['1h'] || 0,
        snowVolume: rawData.snow?.['1h'] || 0,
        sunrise: rawData.sys?.sunrise || 0,
        sunset: rawData.sys?.sunset || 0
    };
}

/**
 * Simulates API response for testing (without real API key)
 * @param {string} city - City name
 * @returns {Object} Mock weather data
 */
export function getMockWeatherData(city) {
    const mockData = {
        'Warszawa': {
            name: 'Warszawa',
            main: { temp: 12, feels_like: 10, humidity: 65, pressure: 1013 },
            weather: [{ main: 'Clouds', description: 'pochmurnie' }],
            wind: { speed: 5 },
            clouds: { all: 60 },
            sys: { country: 'PL', sunrise: 1623825600, sunset: 1623878400 }
        },
        'Kraków': {
            name: 'Kraków',
            main: { temp: 14, feels_like: 13, humidity: 58, pressure: 1015 },
            weather: [{ main: 'Clear', description: 'słonecznie' }],
            wind: { speed: 3 },
            clouds: { all: 10 },
            sys: { country: 'PL', sunrise: 1623825600, sunset: 1623878400 }
        },
        'Gdańsk': {
            name: 'Gdańsk',
            main: { temp: 10, feels_like: 8, humidity: 72, pressure: 1011 },
            weather: [{ main: 'Rain', description: 'pada deszcz' }],
            wind: { speed: 8 },
            clouds: { all: 85 },
            rain: { '1h': 2.5 },
            sys: { country: 'PL', sunrise: 1623825600, sunset: 1623878400 }
        }
    };

    return mockData[city] || mockData['Warszawa'];
}