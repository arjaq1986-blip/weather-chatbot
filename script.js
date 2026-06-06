// ===========================
// CONFIGURATION
// ===========================
const OPENWEATHER_API_KEY = 'YOUR_API_KEY_HERE'; // Wstaw swój klucz API z OpenWeather
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const LOCALSTORAGE_KEY = 'weatherChatHistory';
const MAX_HISTORY = 20;

// ===========================
// DOM ELEMENTS
// ===========================
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const inputForm = document.getElementById('inputForm');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorToast = document.getElementById('errorToast');
const weatherCard = document.getElementById('weatherCard');
const recommendationsCard = document.getElementById('recommendationsCard');
const clothingItems = document.getElementById('clothingItems');
const quickButtons = document.querySelectorAll('.quick-btn');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// ===========================
// WEATHER & CLOTHING DATA
// ===========================
const clothingRecommendations = {
    cold: {
        temp: -100, // Less than -15°C
        items: ['Płaszcz zimowy', 'Czapka', 'Rękawiczki', 'Szalik', 'Buty zimowe', 'Thermal leginsy'],
        icons: ['fas fa-vest', 'fas fa-hat-winter', 'fas fa-hands', 'fas fa-scarf', 'fas fa-boot', 'fas fa-person-hiking'],
        advice: 'Jest bardzo zimno! Ubierz się bardzo ciepło i unikaj przebywania na dworze zbyt długo.'
    },
    cool: {
        temp: 15,
        items: ['Kurtka', 'Sweter', 'Jeans', 'Buty sportowe', 'Szalik', 'Czapka'],
        icons: ['fas fa-jacket', 'fas fa-shirt', 'fas fa-pants', 'fas fa-shoe-prints', 'fas fa-scarf', 'fas fa-hat-winter'],
        advice: 'Pogoda jest chłodna. Narzuć cieplejszą warstwę ubrania.'
    },
    mild: {
        temp: 20,
        items: ['Bluzka', 'Lekka kurtka', 'Jeans', 'Trampki', 'Okulary słoneczne'],
        icons: ['fas fa-shirt', 'fas fa-coat', 'fas fa-pants', 'fas fa-shoe-prints', 'fas fa-glasses'],
        advice: 'Miła pogoda! Możesz ubrać się w lekkie warstwy.'
    },
    warm: {
        temp: 25,
        items: ['T-shirt', 'Szorty', 'Kapcie', 'Okulary słoneczne', 'Czapka baseballowa', 'Klapki'],
        icons: ['fas fa-shirt', 'fas fa-person-hiking', 'fas fa-shoe-prints', 'fas fa-glasses', 'fas fa-baseball-cap', 'fas fa-shoe-prints'],
        advice: 'Jest ciepło! Ubierz się lekko i nie zapomnij o okulach słonecznych.'
    },
    hot: {
        temp: 30,
        items: ['Lekki T-shirt', 'Krótkie szorty', 'Sandały', 'Kapelusz', 'Okulary słoneczne', 'Krótka sukienka'],
        icons: ['fas fa-shirt', 'fas fa-person-hiking', 'fas fa-shoe-prints', 'fas fa-hat', 'fas fa-glasses', 'fas fa-person-dress'],
        advice: 'Jest bardzo gorąco! Ubierz się w najlżejsze ubrania, pamiętaj o ochronie przed słońcem.'
    }
};

const rainyClothing = {
    items: ['Płaszcz przeciwdeszczowy', 'Parasol', 'Wodoodporne buty', 'Spodnie jeans'],
    icons: ['fas fa-coat', 'fas fa-umbrella', 'fas fa-boot', 'fas fa-pants'],
    advice: 'Pada deszcz! Weź parasol i załóż wodoodporne buty.'
};

const snowyClothing = {
    items: ['Płaszcz zimowy', 'Czapka', 'Szalik', 'Rękawiczki', 'Buty zimowe', 'Kulawy'],
    icons: ['fas fa-vest', 'fas fa-hat-winter', 'fas fa-scarf', 'fas fa-hands', 'fas fa-boot', 'fas fa-socks'],
    advice: 'Pada śnieg! Ubierz się bardzo ciepło i ubezpiecz się przed poślizgnięciem.'
};

// ===========================
// INITIALIZATION
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadChatHistory();
    checkApiKey();
});

function initializeEventListeners() {
    inputForm.addEventListener('submit', handleUserInput);
    quickButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const city = e.target.dataset.city;
            userInput.value = city;
            handleWeatherRequest(city);
        });
    });
    clearHistoryBtn.addEventListener('click', clearHistory);
}

function checkApiKey() {
    if (OPENWEATHER_API_KEY === 'YOUR_API_KEY_HERE') {
        showError('⚠️ Błąd konfiguracji: Ustaw swój klucz API OpenWeather w pliku script.js!');
        addBotMessage('Aby bot działał, administrator musi skonfigurować klucz API OpenWeather. Poproś administratora o ustawienie klucza w linii 6 pliku script.js.');
    }
}

// ===========================
// EVENT HANDLERS
// ===========================
function handleUserInput(e) {
    e.preventDefault();
    const input = userInput.value.trim();
    
    if (!input) return;
    
    addUserMessage(input);
    userInput.value = '';
    userInput.focus();
    
    handleWeatherRequest(input);
}

function handleWeatherRequest(city) {
    if (!city.trim()) {
        addBotMessage('Proszę wpisać nazwę miasta.');
        return;
    }
    
    showLoading();
    fetchWeatherData(city);
}

// ===========================
// WEATHER API
// ===========================
async function fetchWeatherData(city) {
    try {
        if (OPENWEATHER_API_KEY === 'YOUR_API_KEY_HERE') {
            throw new Error('API Key not configured');
        }

        const response = await fetch(
            `${API_BASE_URL}?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pl`
        );

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Nie znaleziono miasta. Sprawdź pisownię i spróbuj ponownie.');
            } else if (response.status === 401) {
                throw new Error('Błąd API: Klucz autoryzacji jest nieprawidłowy.');
            }
            throw new Error('Błąd podczas pobierania danych pogody.');
        }

        const weatherData = await response.json();
        hideLoading();
        processWeatherData(weatherData);
    } catch (error) {
        hideLoading();
        handleWeatherError(error);
    }
}

function processWeatherData(data) {
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = Math.round(data.wind.speed * 3.6); // m/s to km/h
    const condition = data.weather[0].main.toLowerCase();
    
    displayWeatherInfo(data.name, temp, description, humidity, windSpeed);
    generateClothingRecommendations(temp, condition, humidity, windSpeed);
    saveToHistory(data.name, temp, condition);
}

function displayWeatherInfo(city, temp, description, humidity, windSpeed) {
    document.getElementById('weatherCity').textContent = city;
    document.getElementById('weatherTemp').textContent = `${temp}°C`;
    document.getElementById('weatherDesc').textContent = description.charAt(0).toUpperCase() + description.slice(1);
    document.getElementById('weatherHumidity').textContent = `Wilgotność: ${humidity}%`;
    document.getElementById('weatherWind').textContent = `Wiatr: ${windSpeed} km/h`;
    
    weatherCard.style.display = 'block';
    
    addBotMessage(`Znalazłem informacje dla miasta ${city}! Temperatura: ${temp}°C, ${description}.`);
}

function generateClothingRecommendations(temp, condition, humidity, windSpeed) {
    let recommendations = getTemperatureRecommendations(temp);
    
    // Dodaj rekomendacje dla deszczu
    if (condition.includes('rain')) {
        recommendations.items = [...recommendations.items, ...rainyClothing.items];
        recommendations.icons = [...recommendations.icons, ...rainyClothing.icons];
        recommendations.advice = rainyClothing.advice;
    }
    
    // Dodaj rekomendacje dla śniegu
    if (condition.includes('snow')) {
        recommendations.items = [...recommendations.items, ...snowyClothing.items];
        recommendations.icons = [...recommendations.icons, ...snowyClothing.icons];
        recommendations.advice = snowyClothing.advice;
    }
    
    displayRecommendations(recommendations);
}

function getTemperatureRecommendations(temp) {
    if (temp <= -15) return clothingRecommendations.cold;
    if (temp < 10) return clothingRecommendations.cool;
    if (temp < 18) return clothingRecommendations.mild;
    if (temp < 25) return clothingRecommendations.warm;
    return clothingRecommendations.hot;
}

function displayRecommendations(recommendations) {
    clothingItems.innerHTML = '';
    
    recommendations.items.forEach((item, index) => {
        const iconClass = recommendations.icons[index] || 'fas fa-shirt';
        const div = document.createElement('div');
        div.className = 'clothing-item';
        div.innerHTML = `
            <i class="${iconClass}"></i>
            <span>${item}</span>
        `;
        clothingItems.appendChild(div);
    });
    
    recommendationsCard.style.display = 'block';
    addBotMessage(`💡 ${recommendations.advice}`);
}

// ===========================
// CHAT MESSAGES
// ===========================
function addUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.innerHTML = `<div class="message-content"><p>${escapeHtml(message)}</p></div>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addBotMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messageDiv.innerHTML = `<div class="message-content"><p>${escapeHtml(message)}</p></div>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===========================
// ERROR HANDLING
// ===========================
function handleWeatherError(error) {
    console.error('Weather Error:', error);
    
    let errorMessage = 'Nie udało się pobrać danych pogody. ';
    
    if (error.message.includes('nie znaleziono miasta')) {
        errorMessage = error.message;
    } else if (error.message.includes('klucz')) {
        errorMessage = error.message;
    } else if (error.message === 'API Key not configured') {
        errorMessage = 'Bot nie jest skonfigurowany. Poproś administratora o ustawienie klucza API.';
    }
    
    showError(errorMessage);
    addBotMessage(`❌ ${errorMessage}`);
}

function showError(message) {
    errorToast.textContent = message;
    errorToast.classList.add('show');
    setTimeout(() => errorToast.classList.remove('show'), 4000);
}

// ===========================
// LOADING STATE
// ===========================
function showLoading() {
    loadingSpinner.style.display = 'flex';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
}

// ===========================
// CHAT HISTORY
// ===========================
function saveToHistory(city, temp, condition) {
    let history = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || [];
    
    history.unshift({
        city,
        temp,
        condition,
        timestamp: new Date().toLocaleString('pl-PL')
    });
    
    // Limit history to MAX_HISTORY
    history = history.slice(0, MAX_HISTORY);
    
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(history));
    loadChatHistory();
}

function loadChatHistory() {
    const history = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || [];
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: var(--text-gray); font-size: 0.85rem;">Brak historii</p>';
        return;
    }
    
    history.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <strong>${item.city}</strong>
            <small>${item.temp}°C • ${item.condition}</small>
            <small>${item.timestamp}</small>
        `;
        div.addEventListener('click', () => {
            userInput.value = item.city;
            handleWeatherRequest(item.city);
        });
        historyList.appendChild(div);
    });
}

function clearHistory() {
    if (confirm('Czy na pewno chcesz wyczyścić historię?')) {
        localStorage.removeItem(LOCALSTORAGE_KEY);
        loadChatHistory();
        showError('Historia została wyczyszczona.');
    }
}

// ===========================
// UTILITY FUNCTIONS
// ===========================
function getEmojiForCondition(condition) {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('rain')) return '🌧️';
    if (conditionLower.includes('cloud')) return '☁️';
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) return '☀️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('storm')) return '⛈️';
    if (conditionLower.includes('wind')) return '💨';
    return '🌤️';
}
