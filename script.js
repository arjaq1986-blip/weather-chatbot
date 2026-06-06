// ===========================
// CONFIGURATION
// ===========================
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const LOCALSTORAGE_KEY = 'weatherChatHistory';
const LOCALSTORAGE_API_KEY = 'weatherApiKey';
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
const recommendationText = document.getElementById('recommendationText');
const quickButtons = document.querySelectorAll('.quick-btn');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// ===========================
// API KEY PANEL
// ===========================
function createApiKeyPanel() {
    const overlay = document.createElement('div');
    overlay.id = 'apiKeyOverlay';
    overlay.style.cssText = `
        position: fixed; inset: 0; background: rgba(0,0,0,0.55);
        display: flex; align-items: center; justify-content: center;
        z-index: 9999; font-family: inherit;
    `;

    overlay.innerHTML = `
        <div style="
            background: #fff; border-radius: 12px; padding: 2rem;
            width: 100%; max-width: 420px; box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        ">
            <h2 style="margin:0 0 0.5rem">🌤️ Połącz swoje konto OpenWeatherMap</h2>
            <p style="color:#555; font-size:0.9rem; margin:0 0 1.25rem">
                Wpisz swój osobisty klucz API z
                <a href="https://home.openweathermap.org/api_keys" target="_blank" rel="noopener">
                    openweathermap.org
                </a>.
                Zostanie zapisany lokalnie w przeglądarce i nigdzie nie będzie wysyłany.
            </p>
            <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.4rem">
                Klucz API
            </label>
            <input
                id="apiKeyInput"
                type="password"
                placeholder="Wklej swój klucz API tutaj…"
                autocomplete="off"
                style="
                    width: 100%; box-sizing: border-box; padding: 0.6rem 0.75rem;
                    border: 1px solid #ccc; border-radius: 8px; font-size: 1rem;
                    margin-bottom: 0.5rem;
                "
            />
            <div id="apiKeyError" style="color:#c0392b; font-size:0.82rem; min-height:1.1rem; margin-bottom:0.75rem;"></div>
            <div style="display:flex; gap:0.75rem;">
                <button id="apiKeySaveBtn" style="
                    flex:1; padding:0.65rem; background: linear-gradient(135deg, #6366f1, #ec4899);
                    color:#fff; border:none; border-radius:8px; font-size:1rem; cursor:pointer;
                ">Zapisz i połącz</button>
                <button id="apiKeySkipBtn" style="
                    flex:1; padding:0.65rem; background:#f0f0f0; color:#333;
                    border:none; border-radius:8px; font-size:1rem; cursor:pointer;
                ">Użyj bez API</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('apiKeySaveBtn').addEventListener('click', () => {
        const key = document.getElementById('apiKeyInput').value.trim();
        if (!key) {
            document.getElementById('apiKeyError').textContent = 'Proszę wpisać prawidłowy klucz API.';
            return;
        }
        localStorage.setItem(LOCALSTORAGE_API_KEY, key);
        overlay.remove();
        addBotMessage('✅ Klucz API zapisany! Możesz teraz wyszukiwać pogodę po nazwie miasta.');
    });

    document.getElementById('apiKeySkipBtn').addEventListener('click', () => {
        overlay.remove();
        addBotMessage('ℹ️ Działa bez klucza API — opisz pogodę słowami (np. "15 stopni i pada deszcz"), a doradzę strój!');
    });
}

function getApiKey() {
    return localStorage.getItem(LOCALSTORAGE_API_KEY) || null;
}

// ===========================
// NATURAL LANGUAGE PARSING
// ===========================
const weatherPatterns = {
    temperature: /(\d+)\s*(?:stopni|°C|st|sg)/i,
    rain: /pada\s+deszcz|deszcz|pada|opady|mokro|przelotne|plucha/i,
    snow: /pada\s+śnieg|śnieg|zaspy|mróz|mrozi|zimno/i,
    wind: /wiatr|wieje|silny\s+wiatr|porywy/i,
    sunny: /słonecznie|słońce|bezchmurnie|czysto|pięknie/i,
    cloudy: /pochmurnie|chmury|chmurno|zachmurzenie|zachmurzone/i,
    humidity: /wilgotno|wilgotność/i,
    hot: /gorąco|upał|upal|wysoka\s+temperatura/i,
    cold: /zimno|chłodno|mróz|mrozi|przenikliwe/i
};

// ===========================
// CLOTHING & STYLE DATA
// ===========================
const clothingRecommendations = {
    veryHot: {
        temp: 30,
        clothing: ['Lekki T-shirt', 'Krótkie szorty', 'Sandały'],
        accessories: ['Kapelusz', 'Okulary słoneczne', 'Lekki szalik'],
        protection: ['Krem z SPF 50+', 'Butelka wody'],
        style: ['Minimalistyczne', 'Sportowe', 'Casual'],
        fullAdvice: 'Jest bardzo gorąco! Zalecam lekkie, przewiewne ubrania. Niezwykle ważna jest ochrona przed słońcem - weź kapelusz i okulary. Nie zapomnij o kremie z filtrem SPF i regularnym nawadnianiu się.'
    },
    hot: {
        temp: 25,
        clothing: ['T-shirt', 'Krótkie spodnie', 'Trampki lub sandały'],
        accessories: ['Okulary słoneczne', 'Czapka baseballowa', 'Lekki szalik'],
        protection: ['Krem SPF 30+', 'Parasol'],
        style: ['Casual', 'Sportowe', 'Swobodne'],
        fullAdvice: 'Piękna pogoda! Ubierz się w wygodne, lekkie ubrania. Pamiętaj o okulach słonecznych i kremie ochronnym. Perfect do spacerów i aktywności na świeżym powietrzu.'
    },
    mild: {
        temp: 20,
        clothing: ['Bluzka', 'Leginsy lub jeansy', 'Trampki'],
        accessories: ['Lekka kurtka', 'Okulary'],
        protection: ['Lekki szalik'],
        style: ['Casual', 'Eleganckie', 'Warstwowe'],
        fullAdvice: 'Miła pogoda do wyjścia! Załóż bluzę z lekką warstwą. Stylizacja warstwowa będzie idealna na wypadek zmian temperatury. Ponad warstwę możesz dodać lekką kurtkę.'
    },
    cool: {
        temp: 15,
        clothing: ['Kurtka', 'Sweter', 'Jeansy', 'Buty sportowe'],
        accessories: ['Szalik', 'Czapka', 'Rękawiczki'],
        protection: ['Termiczne pończochy'],
        style: ['Warstwowe', 'Ciepłe', 'Cozy'],
        fullAdvice: 'Chłodno! Zalecam nałożyć warstwę ciepłych ubrań. Szalik, czapka i rękawiczki będą niezbędne. Wybierz kontrast ciepłych kolorów do bardziej stylowego looku.'
    },
    veryCold: {
        temp: -15,
        clothing: ['Płaszcz zimowy', 'Termiczne legginsy', 'Buty zimowe'],
        accessories: ['Czapka', 'Szalik', 'Rękawiczki', 'Naszyjnik'],
        protection: ['Balsam do ust', 'Krem do twarzy'],
        style: ['Ciepłe', 'Eleganckie', 'Wygodne'],
        fullAdvice: 'Jest bardzo zimno! Załóż kilka warstw ciepłych ubrań. Obowiązkowe: płaszcz zimowy, czapka, szalik i rękawiczki. Pamiętaj o ochronie skóry twarzy i ust.'
    },
    rainy: {
        clothing: ['Płaszcz przeciwdeszczowy', 'Wodoodporne buty', 'Spodnie jeans'],
        accessories: ['Parasol', 'Wodoodporny plecak'],
        protection: ['Przeciwdeszczowe zapachy'],
        style: ['Praktyczne', 'Eleganckie', 'Minimalistyczne'],
        advice: 'Pada deszcz! Załóż wodoodporny płaszcz i weź parasol. Wybierz wodoodporne buty, aby uniknąć mokrych stóp. Ciemne kolory będą praktyczne.'
    },
    snowy: {
        clothing: ['Płaszcz zimowy', 'Termiczne legginsy', 'Buty zimowe'],
        accessories: ['Czapka', 'Szalik', 'Rękawiczki'],
        protection: ['Krem na zmęczenie skóry', 'Balsam do ust'],
        style: ['Ciepłe', 'Eleganckie', 'Przewiewne'],
        advice: 'Pada śnieg! Ubierz się bardzo ciepło. Niezwykle ważne są rękawiczki, czapka i szalik. Buty zimowe z dobrym uchwytem będą niezbędne dla bezpieczeństwa.'
    },
    windy: {
        clothing: ['Wiatroodporna kurtka', 'Spodnie'],
        accessories: ['Czapka', 'Szalik'],
        protection: ['Balsam do ust'],
        style: ['Sportowe', 'Praktyczne'],
        advice: 'Wieje silny wiatr! Załóż wiatroodporną kurtkę i przymocuj wszystko. Szalik i czapka będą się przydać. Unikaj latających materiałów.'
    },
    sunny: {
        clothing: ['Lekkie ubrania'],
        accessories: ['Okulary słoneczne', 'Kapelusz'],
        protection: ['Krem SPF 50+', 'Butelka wody'],
        style: ['Jasne kolory', 'Letnie', 'Przewiewne'],
        advice: 'Pięknie i słonecznie! Pamiętaj o kremie ochronnym i okulach słonecznych. Białe i jasne kolory będą idealne. Nie zapomnij o wodzie!'
    },
    cloudy: {
        clothing: ['Normalne ubrania'],
        accessories: [],
        protection: [],
        style: ['Uniwersalne'],
        advice: 'Pochmurnie, ale bez opadów. Możesz wybrać dowolny styl. Pamiętaj, że promienie UV przenikają chmury, więc krem ochronny jest nadal ważny.'
    }
};

// ===========================
// INITIALIZATION
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadChatHistory();

    // Show API key panel on first visit (no key stored yet)
    if (!getApiKey()) {
        createApiKeyPanel();
    }

    addBotMessage('Cześć! 👋 Jestem twoim asystentem modowego stylu. Opowiedz mi o pogodzie (np. "Jest 15 stopni i pada deszcz") a dam ci idealne rekomendacje na ubiór, dodatki i styl!');
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

    // Optional: wire up a "Change API key" button if you add one in index.html
    const changeKeyBtn = document.getElementById('changeApiKeyBtn');
    if (changeKeyBtn) {
        changeKeyBtn.addEventListener('click', createApiKeyPanel);
    }
}

// ===========================
// NATURAL LANGUAGE PROCESSING
// ===========================
function parseWeatherInput(input) {
    const weatherData = {
        temperature: null,
        hasRain: false,
        hasSnow: false,
        hasWind: false,
        isSunny: false,
        isCloudy: false,
        rawInput: input
    };

    const tempMatch = input.match(weatherPatterns.temperature);
    if (tempMatch) {
        weatherData.temperature = parseInt(tempMatch[1]);
    }

    weatherData.hasRain = weatherPatterns.rain.test(input);
    weatherData.hasSnow = weatherPatterns.snow.test(input);
    weatherData.hasWind = weatherPatterns.wind.test(input);
    weatherData.isSunny = weatherPatterns.sunny.test(input);
    weatherData.isCloudy = weatherPatterns.cloudy.test(input);

    return weatherData;
}

function generateRecommendations(weatherData) {
    let recommendations = {
        clothing: [],
        accessories: [],
        protection: [],
        style: [],
        advice: ''
    };

    let baseRec = clothingRecommendations.mild;

    if (weatherData.temperature !== null) {
        if (weatherData.temperature >= 28) {
            baseRec = clothingRecommendations.veryHot;
        } else if (weatherData.temperature >= 23) {
            baseRec = clothingRecommendations.hot;
        } else if (weatherData.temperature >= 18) {
            baseRec = clothingRecommendations.mild;
        } else if (weatherData.temperature >= 10) {
            baseRec = clothingRecommendations.cool;
        } else {
            baseRec = clothingRecommendations.veryCold;
        }
    }

    recommendations.clothing = [...baseRec.clothing];
    recommendations.accessories = [...baseRec.accessories];
    recommendations.protection = [...baseRec.protection];
    recommendations.style = [...baseRec.style];
    recommendations.advice = baseRec.fullAdvice;

    if (weatherData.hasRain) {
        recommendations.clothing.push(...clothingRecommendations.rainy.clothing);
        recommendations.accessories.push(...clothingRecommendations.rainy.accessories);
        recommendations.advice = clothingRecommendations.rainy.advice;
    }

    if (weatherData.hasSnow) {
        recommendations.clothing.push(...clothingRecommendations.snowy.clothing);
        recommendations.accessories.push(...clothingRecommendations.snowy.accessories);
        recommendations.protection.push(...clothingRecommendations.snowy.protection);
        recommendations.advice = clothingRecommendations.snowy.advice;
    }

    if (weatherData.hasWind) {
        recommendations.clothing.push(clothingRecommendations.windy.clothing[0]);
        recommendations.accessories.push(...clothingRecommendations.windy.accessories);
    }

    if (weatherData.isSunny && !weatherData.hasRain) {
        recommendations.protection.push(...clothingRecommendations.sunny.protection);
    }

    recommendations.clothing = [...new Set(recommendations.clothing)];
    recommendations.accessories = [...new Set(recommendations.accessories)];
    recommendations.protection = [...new Set(recommendations.protection)];

    return recommendations;
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

    const weatherData = parseWeatherInput(input);

    if (weatherData.temperature === null && !weatherData.hasRain && !weatherData.hasSnow) {
        handleWeatherRequest(input);
    } else {
        processWeatherDescription(weatherData);
    }
}

function handleWeatherRequest(city) {
    if (!city.trim()) {
        addBotMessage('Proszę opisać pogodę (np. "Jest 15 stopni i pada deszcz") lub podać nazwę miasta.');
        return;
    }

    showLoading();
    fetchWeatherData(city);
}

// ===========================
// WEATHER API
// ===========================
async function fetchWeatherData(city) {
    const apiKey = getApiKey();

    if (!apiKey) {
        hideLoading();
        addBotMessage('🔑 Nie masz jeszcze klucza API. Zaloguj się, aby wyszukiwać pogodę po nazwie miasta.');
        createApiKeyPanel();
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=pl`
        );

        hideLoading();

        if (!response.ok) {
            if (response.status === 401) {
                addBotMessage('❌ Nieprawidłowy klucz API. Sprawdź go i spróbuj ponownie.');
                createApiKeyPanel();
            } else {
                addBotMessage(`⚠️ Nie znaleziono miasta "${city}". Spróbuj opisać pogodę słowami.`);
            }
            return;
        }

        const data = await response.json();
        processAPIWeatherData(data);
    } catch (error) {
        hideLoading();
        addBotMessage('⚠️ Błąd połączenia. Sprawdź internet lub opisz pogodę ręcznie.');
    }
}

function processAPIWeatherData(data) {
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const condition = data.weather[0].main.toLowerCase();

    const weatherData = {
        temperature: temp,
        hasRain: condition.includes('rain'),
        hasSnow: condition.includes('snow'),
        hasWind: data.wind.speed > 6,
        isSunny: condition.includes('clear') || condition.includes('sunny'),
        isCloudy: condition.includes('cloud'),
        city: data.name
    };

    addBotMessage(`📍 ${data.name}: ${temp}°C, ${description}`);
    displayRecommendationCard(weatherData);
    saveToHistory(data.name, temp, condition);
}

function processWeatherDescription(weatherData) {
    const recommendations = generateRecommendations(weatherData);
    displayRecommendations(recommendations, weatherData);
    saveWeatherToHistory(weatherData);
}

// ===========================
// DISPLAY FUNCTIONS
// ===========================
function displayRecommendations(recommendations, weatherData) {
    clothingItems.innerHTML = '';

    let fullRecommendation = `💡 **Moje rekomendacje na ubiór:**\n\n`;

    if (recommendations.clothing.length > 0) {
        fullRecommendation += `👕 **Ubranie:**\n${recommendations.clothing.map(item => `• ${item}`).join('\n')}\n\n`;
    }
    if (recommendations.accessories.length > 0) {
        fullRecommendation += `✨ **Dodatki:**\n${recommendations.accessories.map(item => `• ${item}`).join('\n')}\n\n`;
    }
    if (recommendations.protection.length > 0) {
        fullRecommendation += `🛡️ **Ochrona:**\n${recommendations.protection.map(item => `• ${item}`).join('\n')}\n\n`;
    }
    if (recommendations.style.length > 0) {
        fullRecommendation += `🎨 **Styl:**\n${recommendations.style.map(item => `• ${item}`).join('\n')}\n\n`;
    }

    fullRecommendation += `\n📝 ${recommendations.advice}`;

    recommendations.clothing.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'clothing-item';
        div.innerHTML = `<span>${item}</span>`;
        clothingItems.appendChild(div);
    });

    recommendationsCard.style.display = 'block';
    addBotMessage(fullRecommendation);
}

function displayRecommendationCard(weatherData) {
    const recommendations = generateRecommendations(weatherData);
    displayRecommendations(recommendations, weatherData);
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

    let htmlMessage = escapeHtml(message);
    htmlMessage = htmlMessage
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.*?)__/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');

    messageDiv.innerHTML = `<div class="message-content"><p>${htmlMessage}</p></div>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
function saveWeatherToHistory(weatherData) {
    let history = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || [];

    history.unshift({
        description: weatherData.rawInput,
        temperature: weatherData.temperature,
        timestamp: new Date().toLocaleString('pl-PL')
    });

    history = history.slice(0, MAX_HISTORY);
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(history));
    loadChatHistory();
}

function saveToHistory(city, temp, condition) {
    let history = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || [];

    history.unshift({
        city,
        temp,
        condition,
        timestamp: new Date().toLocaleString('pl-PL')
    });

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

    history.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'history-item';

        if (item.city) {
            div.innerHTML = `
                <strong>${item.city}</strong>
                <small>${item.temp}°C • ${item.condition}</small>
                <small>${item.timestamp}</small>
            `;
            div.addEventListener('click', () => {
                userInput.value = item.city;
                handleWeatherRequest(item.city);
            });
        } else {
            div.innerHTML = `
                <strong>${item.description}</strong>
                <small>${item.temperature ? item.temperature + '°C' : 'Brak temp.'}</small>
                <small>${item.timestamp}</small>
            `;
            div.addEventListener('click', () => {
                userInput.value = item.description;
                const weatherData = parseWeatherInput(item.description);
                processWeatherDescription(weatherData);
            });
        }

        historyList.appendChild(div);
    });
}

function clearHistory() {
    if (confirm('Czy na pewno chcesz wyczyścić historię?')) {
        localStorage.removeItem(LOCALSTORAGE_KEY);
        loadChatHistory();
    }
}
