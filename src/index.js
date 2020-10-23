let dateElement = document.querySelector("#date-now");
let timeNow = new Date();
let hours = timeNow.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = timeNow.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}

dateElement.innerHTML = `${hours}:${minutes}`;

let currentElement = document.querySelector("#day-now");
let day = timeNow.getDay();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thurday",
  "Friday",
  "Saturday"
];
let date = timeNow.getDate();
let month = timeNow.getMonth();
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
let year = timeNow.getFullYear();

currentElement.innerHTML = `<strong>${days[day]} ${months[month]} ${date} , ${year}</strong>`;

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
