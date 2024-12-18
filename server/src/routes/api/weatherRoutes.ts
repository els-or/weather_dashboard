import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// Done: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { cityName } = req.body;

  // Done: GET weather data from city name
  const weatherData = await WeatherService.getWeatherForCity(cityName)
 // Done: save city to search history
  await HistoryService.addCity(cityName);

  res.json(weatherData);

});

// Done: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  const getCities = await HistoryService.getCities();
  res.json(getCities);
});

// * BONUS Done: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await HistoryService.removeCity(id);
  res.sendStatus(204);
});

export default router;
