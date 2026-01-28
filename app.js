/**
 * LumiSky - Next-Gen Weather App
 */

// 1. YOUR API KEY
const apiKey = "6c7d863c1ff3054cf8551853b72697cc";

const cityInput = document.getElementById('cityInput');
const cityName = document.getElementById('cityName');
const currentTime = document.getElementById('currentTime');
const temp = document.getElementById('temp');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const feelsLike = document.getElementById('feelsLike');
const pressure = document.getElementById('pressure');
const weatherDisplay = document.getElementById('weatherDisplay');
const errorMessage = document.getElementById('errorMessage');

// Update Clock
function updateClock() {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' };
    currentTime.textContent = now.toLocaleDateString('en-US', options);
}
setInterval(updateClock, 1000);
updateClock();

// Event listener
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather(cityInput.value);
    }
});

async function getWeather(city) {
    if (!city) return;
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        updateUI(data);
        errorMessage.style.display = 'none';
        weatherDisplay.style.opacity = '1';
    } catch (error) {
        errorMessage.style.display = 'block';
        weatherDisplay.style.opacity = '0.3';
    }
}

async function getWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        getWeather('Jakarta');
    }
}

function updateUI(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temp.textContent = Math.round(data.main.temp);
    description.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    pressure.textContent = `${data.main.pressure} hPa`;

    updateBackground(data.weather[0].main);

    // Smooth transition
    weatherDisplay.style.animation = 'none';
    void weatherDisplay.offsetWidth;
    weatherDisplay.style.animation = 'fadeIn 1s ease forwards';
}

function updateBackground(condition) {
    const body = document.body;
    body.classList.remove('bg-sunny', 'bg-rainy', 'bg-cloudy', 'bg-snowy');
    const main = condition.toLowerCase();

    if (main.includes('clear')) body.classList.add('bg-sunny');
    else if (main.includes('cloud')) body.classList.add('bg-cloudy');
    else if (main.includes('rain') || main.includes('drizzle') || main.includes('storm')) body.classList.add('bg-rainy');
    else if (main.includes('snow')) body.classList.add('bg-snowy');
}

// Init
window.onload = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            getWeatherByCoords(position.coords.latitude, position.coords.longitude);
        }, () => getWeather('Jakarta'));
    } else getWeather('Jakarta');
};
