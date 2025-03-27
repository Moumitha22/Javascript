const API_KEY = "bfb0065a62e27ca95b1b93d2d19ffca8";
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weatherContent = document.querySelector(".weather-content");
const errorField = document.querySelector(".error");
const errorMsg = document.querySelector(".error p"); 

async function getWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();
        
        document.querySelector(".city").textContent = data.name;
        document.querySelector(".temp").textContent = Math.round(data.main.temp) + "°C";
        document.querySelector(".desc").textContent = data.weather[0].description;
        document.querySelector(".humidity").textContent = data.main.humidity + "%";
        document.querySelector(".wind").textContent = data.wind.speed + " km/h";

        weatherContent.style.display = "block";
        errorField.style.display = "none";
    } catch (error) {
        console.error(error);
        errorMsg.textContent = error.message;
        errorField.style.display = "block";
        weatherContent.style.display = "none";
    }
}


function getCity() {
    const city = cityInput.value.trim();
    if (!city) {
        errorMsg.textContent = "Please enter a city name.";
        errorField.style.display = "block";
        weatherContent.style.display = "none";
        return;
    }
    getWeather(city);
    cityInput.value = ""; 
}


searchBtn.addEventListener("click", () => getCity());
document.addEventListener("keydown",(e)=> (e.key === "Enter")? getCity() : "");
