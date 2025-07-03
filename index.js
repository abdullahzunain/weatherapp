const key = "8ea0c0494db24ca8abcc390bb4aaefc5";

async function fetchWeather(city) {
  if (!city) {
    document.getElementById('weather-result').textContent = "Please select a city.";
    return;
  }

  const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)},PK&limit=1&appid=${key}`;

  try {
    const geoRes = await fetch(geoURL);
    const geoData = await geoRes.json();

    if (!geoData.length) {
      document.getElementById('weather-result').textContent = "City not found!";
      return;
    }

    const { lat, lon, name, country } = geoData[0];

    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;
    const weatherRes = await fetch(weatherURL);
    const weatherData = await weatherRes.json();

    const temp = weatherData.main.temp;
    const desc = weatherData.weather[0].description;

    document.getElementById('weather-result').innerHTML = `
      <h2>${name}, ${country}</h2>
      <p>Temperature: ${temp}°C</p>
      <p>Condition: ${desc}</p>
    `;
  } catch (error) {
    console.error(error);
    document.getElementById('weather-result').textContent = "Error fetching data!";
  }
}

const debouncedFetchWeather = _.debounce(fetchWeather, 300);

document.getElementById('city-select').addEventListener('change', function () {
  const selectedCity = this.value;
  debouncedFetchWeather(selectedCity);
});
