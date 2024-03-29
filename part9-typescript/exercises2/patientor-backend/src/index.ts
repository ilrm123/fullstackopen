import express from 'express';
import diagnosisRouter from './routes/diagnosisRoute';
import patientRouter from './routes/patientRoute';
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/diagnoses', diagnosisRouter);

app.use('/api/patients', patientRouter);

app.use('/api/patients/:id', patientRouter)

app.use('/api/patients/:id/entries', patientRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
