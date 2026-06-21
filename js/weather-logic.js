// ===========================
// WEATHER LOGIC MODULE
// ===========================

import { CONFIG, WEATHER_PATTERNS, CLOTHING_DATABASE } from './config.js';

/**
 * Analyzes temperature and returns clothing category
 * @param {number} temp - Temperature in Celsius
 * @returns {Object} Clothing recommendation object
 */
export function getClothingByTemperature(temp) {
    if (temp >= CONFIG.WEATHER.TEMP_VERY_HOT) {
        return { ...CLOTHING_DATABASE.veryHot, category: 'very-hot' };
    } else if (temp >= CONFIG.WEATHER.TEMP_HOT) {
        return { ...CLOTHING_DATABASE.hot, category: 'hot' };
    } else if (temp >= CONFIG.WEATHER.TEMP_MODERATE) {
        return { ...CLOTHING_DATABASE.moderate, category: 'moderate' };
    } else if (temp >= CONFIG.WEATHER.TEMP_COLD) {
        return { ...CLOTHING_DATABASE.cold, category: 'cold' };
    } else {
        return { ...CLOTHING_DATABASE.veryCold, category: 'very-cold' };
    }
}

/**
 * Generates personalized weather advice based on conditions
 * @param {Object} weatherData - Parsed weather data
 * @returns {Object} Comprehensive recommendation object
 */
export function generateWeatherAdvice(weatherData) {
    const clothing = getClothingByTemperature(weatherData.temperature);
    const advice = [];
    const warnings = [];
    const emojis = [];

    // Temperature advice
    advice.push(generateTemperatureAdvice(weatherData.temperature));

    // Humidity advice
    if (weatherData.humidity > 80) {
        advice.push('Wysokie wilgotność - nosić oddychające ubrania.');
    } else if (weatherData.humidity < 30) {
        advice.push('Niska wilgotność - pamiętaj o hydratacji skóry.');
    }

    // Wind advice
    if (weatherData.windSpeed > 10) {
        warnings.push('⚠️ Silny wiatr - ubrania mogą się przesuwać.');
        clothing.accessories.push('Kurtka wiatroodporna');
    }

    // Rain handling
    if (weatherData.rainVolume > 0 || WEATHER_PATTERNS.rain.test(weatherData.description)) {
        advice.push('Pada deszcz - weź parasolkę i buty wodoodporne.');
        clothing.accessories.push('Parasol');
        clothing.accessories.push('Wodoodporne buty');
        emojis.push('☔');
    }

    // Snow handling
    if (weatherData.snowVolume > 0 || WEATHER_PATTERNS.snow.test(weatherData.description)) {
        advice.push('Pada śnieg - ubierz się ciepło i bezpiecznie!');
        clothing.accessories.push('Buty zimowe');
        emojis.push('❄️');
    }

    // UV protection
    if (weatherData.cloudiness < 30 && weatherData.temperature > 20) {
        warnings.push('☀️ Silne UV - nie zapomnij o kremie SPF!');
    }

    // Visibility
    if (weatherData.visibility < 1000) {
        warnings.push('⚠️ Niska widoczność - nosić ubrania w jasnych kolorach.');
    }

    return {
        city: weatherData.city,
        temperature: weatherData.temperature,
        feelsLike: weatherData.feelsLike,
        condition: weatherData.description,
        clothing: clothing.clothing,
        accessories: [...new Set(clothing.accessories)],
        protection: clothing.protection,
        style: clothing.style,
        advice: [...new Set(advice)],
        warnings: [...new Set(warnings)],
        emojis,
        fullAdvice: generateFullAdvice(weatherData, clothing, advice, warnings)
    };
}

/**
 * Generates temperature-specific advice
 * @private
 */
function generateTemperatureAdvice(temp) {
    if (temp >= 30) {
        return '🔥 Jest bardzo gorąco - pamiętaj o wodzie i kremie z filtrem!';
    } else if (temp >= 20) {
        return '☀️ Ciepło - idealne warunki do lekkiego ubrania.';
    } else if (temp >= 10) {
        return '🌤️ Umiarkowana temperatura - przydałaby się jakaś warstwa.';
    } else if (temp >= 0) {
        return '❄️ Zimno - potrzebujesz ciepłych ubrań.';
    } else {
        return '🥶 Bardzo zimno - maksymalna izolacja termiczna!';
    }
}

/**
 * Generates comprehensive advice text
 * @private
 */
function generateFullAdvice(weatherData, clothing, advice, warnings) {
    let text = `🌍 Pogoda w ${weatherData.city}: ${weatherData.description}\n\n`;
    text += `🌡️ Temperatura: ${weatherData.temperature}°C (odczuwalna: ${weatherData.feelsLike}°C)\n`;
    text += `💧 Wilgotność: ${weatherData.humidity}%\n`;
    text += `💨 Wiatr: ${weatherData.windSpeed} km/h\n\n`;
    text += `👕 **Rekomendowana odzież:**\n`;
    clothing.clothing.forEach(item => text += `  • ${item}\n`);
    text += `\n🎒 **Akcesoria:**\n`;
    clothing.accessories.forEach(item => text += `  • ${item}\n`);
    text += `\n🛡️ **Ochrona:**\n`;
    clothing.protection.forEach(item => text += `  • ${item}\n`);
    
    if (warnings.length > 0) {
        text += `\n⚠️ **Uwagi:**\n`;
        warnings.forEach(warning => text += `  ${warning}\n`);
    }

    return text;
}

/**
 * Parses natural language weather input
 * @param {string} input - User's natural language input
 * @returns {Object} Extracted weather parameters
 */
export function parseNaturalLanguageInput(input) {
    const result = {
        temperature: null,
        hasRain: false,
        hasSnow: false,
        hasWind: false,
        isSunny: false,
        isCloudy: false,
        isHot: false,
        isCold: false,
        isStorm: false,
        city: null
    };

    // Temperature
    const tempMatch = input.match(WEATHER_PATTERNS.temperature);
    if (tempMatch) {
        result.temperature = parseInt(tempMatch[1]);
    }

    // Weather conditions
    result.hasRain = WEATHER_PATTERNS.rain.test(input);
    result.hasSnow = WEATHER_PATTERNS.snow.test(input);
    result.hasWind = WEATHER_PATTERNS.wind.test(input);
    result.isSunny = WEATHER_PATTERNS.sunny.test(input);
    result.isCloudy = WEATHER_PATTERNS.cloudy.test(input);
    result.isHot = WEATHER_PATTERNS.hot.test(input);
    result.isCold = WEATHER_PATTERNS.cold.test(input);
    result.isStorm = WEATHER_PATTERNS.storm.test(input);

    return result;
}