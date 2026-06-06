<!-- markdownlint-disable MD003 MD013 -->
# 🌤️ Bot Doradzający Ubiór do Pogody

Inteligentny agent AI na stronie internetowej, który rekomenduje odpowiedni ubiór do bieżących warunków pogodowych.

## 📋 Spis Treści

- [Opis Projektu](#opis-projektu)
- [Wymagania](#wymagania)
- [Cechy](#cechy)
- [Instalacja](#instalacja)
- [Konfiguracja](#konfiguracja)
- [Użytkowanie](#użytkowanie)
- [Struktura Projektu](#struktura-projektu)
- [Technologie](#technologie)
- [Wdrażanie](#wdrażanie)

## 📝 Opis Projektu

Bot to nowoczesna aplikacja webowa, która:
- Pobiera aktualne dane pogodowe z API OpenWeather
- Analizuje warunki pogodowe (temperatura, opady, wiatr, itp.)
- Rekomenduje odpowiednią odzież na podstawie pogody
- Komunikuje się z użytkownikiem przez interfejs czatu
- Zapisuje historię zapytań w LocalStorage

## ✅ Wymagania

- Przeglądarka z obsługą ES6 JavaScript
- Połączenie internetowe (dla API pogody)
- Klucz API z [OpenWeatherMap](https://openweathermap.org/api)

## 🎯 Cechy

### Funkcjonalności
✨ **Czat Konwersacyjny**
- Intuicyjny interfejs czatu
- Animowane wiadomości
- Responsywny design

🌍 **Integracja z OpenWeather API**
- Pobieranie danych pogodowych dla dowolnego miasta
- Informacje o temperaturze, wilgotności, wietrze
- Obsługa błędów i wyjątków

🧥 **Inteligentne Rekomendacje Ubrań**
- 5 kategorii temperatury (bardzo zimno → bardzo gorąco)
- Uwzględnianie opadów deszczu i śniegu
- Personalizowane porady
- Ilustracje ikonek dla każdego elementu garderoby

💾 **LocalStorage**
- Automatyczne zapisywanie historii zapytań
- Szybki dostęp do poprzednich miast
- Maksymalnie 20 ostatnich wyszukiwań

🎨 **Nowoczesny Design**
- Gradient gradientowe kolory
- Płynne animacje i przejścia
- Responsywny layout (mobile-first)
- Dark mode ready

📱 **Responsywność**
- Zoptymalizowane dla urządzeń mobilnych
- Breakpoints dla tabletów i desktopów
- Dotykowy interfejs

🚀 **Szybkie Przyciski**
- 5 polskich miast (Warszawa, Kraków, Wrocław, Gdańsk, Poznań)
- Jedno kliknięcie = natychmiast wynik

## 🔧 Instalacja

### 1. Klonowanie Repozytorium
```bash
git clone https://github.com/arjaq1986-blip/Zadanie-projektowe.git
cd Zadanie-projektowe
```

### 2. Struktura Plików
```
Zadanie-projektowe/
├── index.html
├── style.css
├── script.js
└── README.md
```

### 3. Uruchomienie Lokalnie
- Otwórz `index.html` w przeglądarce
- LUB użyj serwera lokalnego (np. Live Server w VS Code)

```bash
# Jeśli masz Python 3
python -m http.server 8000

# Jeśli masz Node.js
npx http-server
```

## ⚙️ Konfiguracja

### OpenWeather API Key

1. Przejdź na [OpenWeatherMap](https://openweathermap.org/api)
2. Zarejestruj bezpłatne konto
3. Skopiuj swój API Key
4. Otwórz plik `script.js`
5. Znajdź linię 6:
```javascript
const OPENWEATHER_API_KEY = 'YOUR_API_KEY_HERE';
```
6. Zastąp `'YOUR_API_KEY_HERE'` swoim kluczem:
```javascript
const OPENWEATHER_API_KEY = 'abc123def456xyz789';
```
7. Zapisz plik

## 🎮 Użytkowanie

### Podstawowe Kroki
1. Otwórz aplikację w przeglądarce
2. Wpisz nazwę miasta w polu tekstowym lub kliknij jeden z szybkich przycisków
3. Naciśnij Enter lub kliknij przycisk wysyłania (➤)
4. Bot wyświetli:
   - Aktualne warunki pogodowe
   - Informacje o temperaturze, wilgotności, wietrze
   - Rekomendacje ubrań
   - Osobiste porady

### Historia
- Ostatnie 20 wyszukiwań jest automatycznie zapisywane
- Kliknij na element historii aby szybko wyszukać to miasto ponownie
- Kliknij ikonę kosza aby wyczyścić historię

## 📂 Struktura Projektu

### index.html
- Semantyczna struktura HTML5
- Sekcje: header, chat, sidebar
- Elementy interaktywne (buttony, forma)

### style.css
- ~450 linii
- CSS3 z gradientami i animacjami
- Responsive design z media queries
- 3 breakpointy: 1024px, 768px, 480px

### script.js
- ~450 linii JavaScript
- Fetch API do pobierania danych
- LocalStorage API dla historii
- Logika rekomendacji ubrań
- Obsługa zdarzeń i błędów

## 🛠️ Technologie

| Technologia | Zastosowanie |
|------------|------------|
| **HTML5** | Struktura semantyczna |
| **CSS3** | Styling, animacje, responsive |
| **JavaScript (Vanilla)** | Logika aplikacji, API |
| **OpenWeather API** | Dane pogodowe |
| **LocalStorage API** | Przechowywanie historii |
| **Fetch API** | Pobieranie danych |
| **FontAwesome** | Ikony |

## 📊 Kategorie Temperatury

| Zakres | Kategoria | Ubrania |
|--------|-----------|--------|
| ≤ -15°C | Bardzo Zimno | Płaszcz, czapka, szalik, rękawiczki |
| -15 do 10°C | Chłodno | Kurtka, sweter, jeans |
| 10 do 18°C | Łagodnie | Bluzka, lekka kurtka |
| 18 do 25°C | Ciepło | T-shirt, szorty |
| > 25°C | Bardzo Gorąco | Lekkie ubrania, kapelusz |

**Dodatkowe**: Deszcz → parasol, wodoodporne buty | Śnieg → dodatkowe warstwy

## 🌐 Wdrażanie

### GitHub Pages
1. Upewnij się że repozytorium ma ustawienia na Public
2. Przejdź do Settings → Pages
3. Wybierz Source: Main branch
4. Aplikacja będzie dostępna pod: `https://arjaq1986-blip.github.io/Zadanie-projektowe/`

### Azure Static Web Apps
1. Zaloguj się do Azure Portal
2. Utwórz Static Web App
3. Powiąż repozytorium GitHub
4. Ustaw build path: `/`
5. Wdrażanie - automatyczne!

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=.
```

## 📸 Screenshoty

(Dodaj zrzuty ekranu gdy aplikacja będzie gotowa)

## 🐛 Debugowanie

### Aplikacja nie działa?

**Problem: "Błąd konfiguracji: Ustaw swój klucz API"**
- ✅ Sprawdź czy skonfigurałeś klucz API w script.js

**Problem: "Nie znaleziono miasta"**
- ✅ Sprawdź pisownię nazwy miasta
- ✅ Upewnij się że miasto istnieje
- ✅ Spróbuj polskiego wariantu nazwy

**Problem: API nie odpowiada**
- ✅ Sprawdź połączenie internetowe
- ✅ Sprawdź czy klucz API jest aktywny
- ✅ Sprawdź konsolę przeglądarki (F12)

### Konsola przeglądarki
Otwórz Developer Tools (F12) → Console, aby zobaczyć błędy:
```javascript
// Sprawdź czy API Key jest ustawiony
console.log(OPENWEATHER_API_KEY);

// Sprawdź historię
console.log(localStorage.getItem('weatherChatHistory'));
```

## 📝 Notatki Rozwojowe

- Możliwość rozszerzenia o prognozy na kilka dni
- Integracja z Instagram/TikTok do podziału outfitów
- Wielojęzyczność
- Tryb ciemny/jasny
- Powiadomienia push
- Integracja z shoppingiem online

## 📄 Licencja

Ten projekt jest dostępny na licencji MIT.

## 👨‍💻 Autor

**arjaq1986-blip**
- GitHub: [@arjaq1986-blip](https://github.com/arjaq1986-blip)

## 💬 Wsparcie

Jeśli masz pytania lub znaleźć błędy, proszę:
1. Sprawdź sekcję Debugowanie powyżej
2. Otwórz Issue w repozytorium
3. Skontaktuj się bezpośrednio

---

**Stworzone dla projektu:** Bot doradzający ubiór do pogody (HTML + CSS + JavaScript)

**Status:** ✅ Gotowy do użycia

**Ostatnia aktualizacja:** 2026-06-06
