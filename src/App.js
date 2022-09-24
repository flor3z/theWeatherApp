import './scss/style.scss';

import { WEATHER_API_URL, WEATHER_API_KEY } from './api';
import Search from './components/search/search';
import CurrentWeather from './components/current-weather/currentWeather';
import Forecast from './components/forecast/forecast';
import { useState } from 'react';

function App() {
  const [curWeather, setCurWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [isMetric, setIsMetric] = useState(true); //--> contiune here and implement toggle for imperial to metric and back//

  const handleOnSearchChange = (searchData) => {
    console.log(searchData);
    const [lat, lon] = searchData.value.split(' ');

    const curWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=${
        isMetric ? 'metric' : 'imperial'
      }`
    );

    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=${
        isMetric ? 'metric' : 'imperial'
      }`
    );

    Promise.all([curWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherData = await response[0].json();
        const forcastData = await response[1].json();

        setCurWeather({ city: searchData.label, ...weatherData });
        setForecast({ city: searchData.label, ...forcastData });
      })
      .catch((err) => console.log(err));

    console.log(curWeather);
    console.log(forecast);
  };

  return (
    <div className="container">
      <div className="container__search">
        <Search onSearchChange={handleOnSearchChange} />
      </div>
      <div className="container__button">
        <button
          onClick={() => setIsMetric(!isMetric)}
          className="container__button-units"
        >
          {isMetric ? 'Imperial' : 'Metric'}
        </button>
      </div>
      <div className="container__weather">
        {curWeather && <CurrentWeather data={curWeather} isMetric={isMetric} />}
      </div>
      <div className="container__forecast">
        {forecast && <Forecast data={forecast} />}
      </div>
    </div>
  );
}

export default App;
