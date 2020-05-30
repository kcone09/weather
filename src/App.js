import React from "react";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "weather-icons/css/weather-icons.min.css";

import Weather from "./app_component/weather.component";
import Form from "./app_component/form.compnent";

//make api call to this link api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
const APIKEY = "c60388b79d5ff38524a67315bd3c0edb";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      city: undefined,
      country: undefined,
      icon: undefined,
      main: undefined,
      celsius: undefined,
      temp_max: undefined,
      temp_min: undefined,
      description: "",
      error: false,
    };
    this.weatherIcon = {
      Thunderstorm: "wi-thunderstorm",
      Drizzle: "wi-sleet",
      Rain: "wi-storm-showers",
      Snow: "wi-snow",
      Atmosphere: "wi-fog",
      Clear: "wi-day-sunny",
      Clouds: "wi-day-fog",
    };
  }

  componenDidMount() {}

  convertTemp(temp) {
    let cel = Math.floor(temp - 273.15);
    return cel;
  }

  getWeatherIcon(icons, rangeID) {
    switch (true) {
      case rangeID >= 200 && rangeID <= 232:
        this.setState({ icon: icons.Thunderstorm });
        break;
      case rangeID >= 300 && rangeID <= 321:
        this.setState({ icon: icons.Drizzle });
        break;
      case rangeID >= 500 && rangeID <= 531:
        this.setState({ icon: icons.Rain });
        break;
      case rangeID >= 600 && rangeID <= 622:
        this.setState({ icon: icons.Snow });
        break;
      case rangeID >= 701 && rangeID <= 781:
        this.setState({ icon: icons.Atmosphere });
        break;
      case rangeID === 800:
        this.setState({ icon: icons.Clear });
        break;
      case rangeID >= 801 && rangeID <= 804:
        this.setState({ icon: icons.Clouds });
        break;
      default:
        this.setState({ icon: icons.Clouds });
    }
  }

  getWeather = async e => {
    e.preventDefault();

    const city = e.target.elements.city.value;
    const country = e.target.elements.country.value;
    if ((city, country)) {
      const api_call = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${APIKEY}`
      );
      const resp = await api_call.json();

      this.setState({
        city: `${resp.name}, ${resp.sys.country}`,
        celsius: this.convertTemp(resp.main.temp),
        temp_max: this.convertTemp(resp.main.temp_max),
        temp_min: this.convertTemp(resp.main.temp_min),
        description: resp.weather[0].description,
        error: false,
      });

      this.getWeatherIcon(this.weatherIcon, resp.weather[0].id);
    } else {
      this.setState({ error: true });
    }
  };

  render() {
    return (
      <div className="App">
        <Form loadWeather={this.getWeather} error={this.state.error} />
        <Weather
          city={this.state.city}
          country={this.state.country}
          celsius={this.state.celsius}
          temp_max={this.state.temp_max}
          temp_min={this.state.temp_min}
          description={this.state.description}
          weatherIcon={this.state.icon}
        />
      </div>
    );
  }
}

export default App;
