let weatherIcon = document.querySelector("#icon");
let statsDiv = document.querySelector("#stats");
weatherIcon.style.visibility = "hidden";
statsDiv.style.visibility = "hidden";

function formatDate(timestamp, timezone) {
  let timeNow = new Date(timestamp);
  let offset = timeNow.getTimezoneOffset() * 60000;
  let utc = timestamp + offset;
  let cityTime = utc + (1000 * timezone);
  let cityDate = new Date(cityTime);
  let hours = cityDate.getHours();


  //let hours = timeNow.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = cityDate.getMinutes();
  //let minutes = timeNow.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let currentElement = document.querySelector("#day-now");
  let day = cityDate.getDay();
  //let day = timeNow.getDay();
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
  //let date = timeNow.getDate();
  //let month = timeNow.getMonth();
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
  let searchCity = document.querySelector("#search-city");
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

function showCityTemp(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=de721be4f431ff99a9769e3b29d705a6&units=metric`;

  axios.get(apiUrl).then(showTemperature);
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=de721be4f431ff99a9769e3b29d705a6&units=metric`;

  axios.get(apiUrl).then(showTemperature);
}
