let searchCity;
let weatherIcon = document.querySelector("#icon");
let statsDiv = document.querySelector("#stats");
weatherIcon.style.visibility = "hidden";
statsDiv.style.visibility = "hidden";

function getTimezoneDate(timestamp, timezone) {
  let timeNow = new Date(timestamp);
  let offset = timeNow.getTimezoneOffset() * 60000;
  let utc = timestamp + offset;
  let cityTime = utc + (1000 * timezone);

  return new Date(cityTime);
}

function formatDate(timestamp, timezone) {
  let cityDate = getTimezoneDate(timestamp, timezone);
  let hours = cityDate.getHours();

  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = cityDate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let currentElement = document.querySelector("#day-now");
  let day = cityDate.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thurday",
    "Friday",
    "Saturday"
  ];
  let date = cityDate.getDate();
  let month = cityDate.getMonth();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  return `${days[day]}, ${months[month]} ${date} ${hours}:${minutes}`;
}

function putCity(event) {
  searchCity = document.querySelector("#search-city");
  let typedCity = searchCity.value;

  if (typedCity === null) {
    return;
  }

  event.preventDefault();

  if (event.submitter.id === "btnSearch") {
    showCityTemp(typedCity);
  } else {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", putCity);

function showTemperature(response) {
  let bigCard = document.querySelector(".card");
  bigCard.style.height = "450px"
  let temperature = Math.round(response.data.main.temp);
  let h2 = document.querySelector("h2");
  h2.innerHTML = `${temperature}°C`;
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = response.data.name;
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.main.humidity;
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = response.data.wind.speed;
  let skyElement = document.querySelector("#sky");
  skyElement.innerHTML = response.data.weather[0].main;
  weatherIcon.style.visibility = "visible";
  weatherIcon.setAttribute ("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  statsDiv.style.visibility = "visible";
  let dateElement = document.querySelector("#date-now");
  dateElement.innerHTML = formatDate(response.data.dt * 1000, response.data.timezone);
}

function formatHours(timestamp, timezone) {
  let cityDate = getTimezoneDate(timestamp, timezone);
  let hours = cityDate.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  
  let minutes = cityDate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`
}

function showCityTemp(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=de721be4f431ff99a9769e3b29d705a6&units=metric`;
  axios.get(apiUrl).then(showTemperature);
  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=de721be4f431ff99a9769e3b29d705a6&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

function showForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index <5; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
    <div class="col-2 forecast">
    <h5>
      ${formatHours(forecast.dt * 1000, response.data.city.timezone)}
    </h5>
    <img 
    src = "https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png"
    />
    <p class="forecast-temps">
      <strong>${Math.round(forecast.main.temp_max)}°</strong>  |  ${Math.round(forecast.main.temp_min)}°
    </p>
  </div>
    `
  }
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=de721be4f431ff99a9769e3b29d705a6&units=metric`;
  searchCity.value = '';
  axios.get(apiUrl).then(showTemperature);
}