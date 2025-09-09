// console.log("shaurya");
// const API_KEY = "f5d3ff1f56a61fe8614aa7dfb000fe4f";
// async function fetchWeatherDetails(){
//     try{
//          // let latitude = 28.7041;
//     // let longitude = 77.1025;
//     let city = "mathura";
//    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

//     const data =await response.json();
//     console.log("Weather data =>", data);
//     // let newPara= document.createElement("p");
//     // newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`
//     // document.body.appendChild(newPara);
// }
    
//     catch(err){

//     }
// }
//  //showWeather();
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingscreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let currentTab = userTab;
const API_KEY = "f5d3ff1f56a61fe8614aa7dfb000fe4f";
currentTab.classList.add("current-tab");

function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        if (!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            searchForm.classList.add("active");
        } else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantAccessContainer.classList.add("active");
    } else {
        const coordinates = JSON.parse(localCoordinates);
        fetchWeatherInfo(coordinates);
    }
}

async function fetchWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingscreen.classList.add("active");
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        console.log(data);
        loadingscreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (err) {
        loadingscreen.classList.remove("active");
        console.log(err);
    }
}

function renderWeatherInfo(weatherInfo) {
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.textContent = weatherInfo?.name;
    countryIcon.src = `http://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`; // FIXED: ensure HTTPS
    desc.textContent = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`; // FIXED: changed to HTTPS
    temp.textContent = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
    windspeed.textContent = `${weatherInfo?.wind?.speed} m/s`;
    humidity.textContent = `${weatherInfo?.main?.humidity}%`;
    cloudiness.textContent = `${weatherInfo?.clouds?.all}%`;
}

const grantAccessBtn = document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener("click", getLocation); 

let searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!searchInput.value) return;
    fetchSearchWeatherInfo(searchInput.value); // FIXED: use searchInput.value instead of undefined cityName
});

async function fetchSearchWeatherInfo(cityName) {
    loadingscreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        console.log(data);
        loadingscreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (err) {
        loadingscreen.classList.remove("active");
        console.log(err);
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchWeatherInfo(userCoordinates);
}

function showError(error) {
    console.log("Error getting location", error);
}

// FIXED: Call getfromSessionStorage on page load so user location loads by default
window.addEventListener("DOMContentLoaded", getfromSessionStorage);
