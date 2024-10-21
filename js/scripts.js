const weatherKey = "d23265705848caf663e8fd5017e03007";
const unsplashKey = "fRa9hvQXWrAhHsYvEKzS0TrGP1I4EjQ81Mhe9dtCGdk";

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");

const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const countryElement = document.querySelector("#country");
const humidityElement = document.querySelector("#humidity span");
const windElement = document.querySelector("#wind span");

const weatherContainer = document.querySelector("#weather-data");
const errorMessageContainer = document.querySelector("#error-message");
const loader = document.querySelector("#loader");

const toggleLoader = () => loader.classList.toggle("hide");

const showErrorMessage = () => errorMessageContainer.classList.remove("hide");

const hideInformation = () => {
  errorMessageContainer.classList.add("hide");
  weatherContainer.classList.add("hide");
};

const getWeatherData = async (city) => {
  toggleLoader();

  const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherKey}&lang=pt_br`;
  const response = await fetch(apiWeatherURL);
  const data = await response.json();

  toggleLoader();
  return data;
};

const updateBackgroundImage = async (city) => {
  const apiUnsplashURL = `https://api.unsplash.com/photos/random?query=${city}&client_id=${unsplashKey}`;
  const response = await fetch(apiUnsplashURL);
  const data = await response.json();

  const imageUrl = `${data.urls.raw}&w=1600&h=900&fit=crop&q=80`;
  document.body.style.backgroundImage = `url(${imageUrl})`;
}

const showWeatherData = async (city) => {
  hideInformation();

  const data = await getWeatherData(city);

  if (data.cod === "404") {
    showErrorMessage();
    return;
  }

  cityElement.innerText = data.name;
  tempElement.innerText = parseInt(data.main.temp);
  descElement.innerText = data.weather[0].description;

  weatherIconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
  );

  countryElement.setAttribute(
    "src",
    `https://flagsapi.com/${data.sys.country}/flat/24.png`
  );

  humidityElement.innerText = `${data.main.humidity}%`;
  windElement.innerText = `${data.wind.speed}km/h`;

  await updateBackgroundImage(city);

  weatherContainer.classList.remove("hide");
};

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const city = cityInput.value;

  showWeatherData(city);
});

cityInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    const city = e.target.value;

    showWeatherData(city);
  }
});
