import express from 'express';
const app = express();

app.use(express.json());

import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {

  try {
      const bmiResult = calculateBmi(Number(req.query.height), Number(req.query.weight));

      const newString = `{"weight": ${req.query.weight}, "height": ${req.query.height}, "bmi": "${bmiResult}"}`;
      
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const newJson = JSON.parse(newString);

      res.send(newJson);
  } catch (error) {
      res.send(JSON.parse(`{"error": "malformatted parameters"}`));
  }

});

app.post('/exercises', (req, res) => {

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (req.body.daily_exercises == undefined || req.body.target == undefined) {
    res.send(JSON.parse(`{"error": "parameters missing"}`));
  } else try {

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const exerciseResult = calculateExercises(req.body.daily_exercises, Number(req.body.target)); // eslint-disable-line @typescript-eslint/no-unsafe-argument
    res.send(exerciseResult);

  } catch (error) {
    res.send(JSON.parse(`{"error": "malformatted parameters"}`));
  }

});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
