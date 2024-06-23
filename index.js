let tabs = document.querySelectorAll(".tab");
let tab1 = tabs[0];
let tab2 = tabs[1];
let currentTab = tab1;
const API_KEY = "f6c495f0a40ba1c8f6e88a783c52a5d1";
let weatherInfo = document.querySelector(".weather-info");
let grantContainer = document.querySelector(".grant-container");
let formContainer = document.querySelector(".form-container");
let loadingScreen = document.querySelector(".loading-container");

getFromSessionStorage();

currentTab.classList.add("tab-active");
function switchTab(i){
    if(currentTab != i){
        currentTab.classList.remove("tab-active");
        currentTab = i;
        currentTab.classList.add("tab-active");
        
        if(currentTab == tab2){
            formContainer.classList.add("active");
            grantContainer.classList.remove("active");
            weatherInfo.classList.remove("active");
        }
        else{
            formContainer.classList.remove("active");
            weatherInfo.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

tabs.forEach(function(i){
    i.addEventListener("click", function(){
        switchTab(i);
    })
})

function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    grantContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        weatherInfo.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(e){
        loadingScreen.classList.remove("active");
        alert("Failed to fetch weather information");
    }
}

let windspeed = document.querySelector(".windspeed");
let humidity = document.querySelector(".humidity");
let clouds = document.querySelector(".clouds");
let cityName = document.querySelector(".city-name");
let flag = document.querySelector(".flag");
let desc = document.querySelector(".desc");
let weatherIcon = document.querySelector(".weather-icon");
let temp = document.querySelector(".temp");

function renderWeatherInfo(data){
    cityName.innerText = data?.name || "Unknown";
    flag.src = `https://flagcdn.com/144x108/${data?.sys?.country?.toLowerCase()}.png`;
    desc.innerText = data?.weather[0]?.main || "N/A";
    weatherIcon.src = `https://openweathermap.org/img/w/${data?.weather[0]?.icon}.png`; 
    temp.innerText = `${data?.main?.temp} °C`;
    windspeed.innerText = `${data?.wind?.speed}m/s`;
    humidity.innerText =`${data?.main?.humidity}%` ;
    clouds.innerText = `${data?.clouds?.all}%` ;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Geolocation is not supported by this browser.");
    }
}

let grantAccess = document.querySelector(".grant-access");
grantAccess.addEventListener("click", getLocation);

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

let form = document.querySelector(".form-container");
let search = document.querySelector(".search");

form.addEventListener("submit", function(e){
    e.preventDefault();
    if(search.value === "") return;

    fetchSearchWeatherInfo(search.value);
})
async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    weatherInfo.classList.remove("active");
    grantContainer.classList.remove("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        weatherInfo.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(e){
        loadingScreen.classList.remove("active");
        alert("No city found");
    }
}