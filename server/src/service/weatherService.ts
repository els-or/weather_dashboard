import dotenv from 'dotenv';
dotenv.config();

//  DONE: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

//  DONE: Define a class for the Weather object
class Weather {
  private city: string; 
  private date: Date;
  private icon: string;
  private iconDescription: string;
  private tempF: number;
  private windSpeed: number;
  private humidity: number;

  constructor(city: string, date: Date, icon: string, iconDescription: string, tempF: number, windSpeed: number, humidity: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}


//  DONE: Complete the WeatherService class
class WeatherService {
  //  DONE: Define the baseURL, API key, and city name properties
  private baseURL?: string | undefined;
  private apiKey?: string | undefined;
  private cityName?: string;
  
  constructor() {
    this.baseURL = process.env.API_BASE_URL;
    this.apiKey = process.env.API_KEY;
    this.cityName = '';
  } 
  //  DONE: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await fetch(query);
    const data = await response.json();
    return data;
  }
  //  DONE: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }
  //  DONE: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const { baseURL, apiKey, cityName
    } = this;
    return `${baseURL}/geocode/v1/json?q=${cityName}&key=${apiKey}`;
  }

  //  DONE: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { baseURL, apiKey } = this;
    const { lat, lon } = coordinates;
    return `${baseURL}/weather/1.0/report.json?product=current&latitude=${lat}&longitude=${lon}&units=imperial&apiKey=${apiKey}`;
  }
  //  DONE: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }
  //  DONE: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(query);
    const data = await response.json();
    return data;
  }
  //  DONE: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const { data } = response;
    const { weather } = data.list[0];
    const currentWeather = new Weather(
      weather.city.name, 
      new Date(weather.dt_txt), 
      weather.weather[0].icon, 
      weather.weather[0].description,
      weather.main.temp,
      weather.wind.speed,
      weather.main.humidity
    );
    return currentWeather;
  }
  //  DONE: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any) {
    let forecastArray: Weather[] = [];
    forecastArray.push(currentWeather);
    const { list } = weatherData.list;
    for (let i = 1; i < list.length; i++) {
      const weather = list[i];
      const forecast = new Weather(
        weather.city.name, 
        new Date(weather.dt_txt), 
        weather.weather[0].icon, 
        weather.weather[0].description,
        weather.main.temp,
        weather.wind.speed,
        weather.main.humidity
      );
      forecastArray.push(forecast);
    }
    return forecastArray;
  }
  //  DONE: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData);
    return { currentWeather, forecastArray };
  }
}

export default new WeatherService();
