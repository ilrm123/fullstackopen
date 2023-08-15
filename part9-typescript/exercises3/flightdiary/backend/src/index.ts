import express from 'express';
import diaryRouter from './routes/diaries';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const cors = require('cors'); // eslint-disable-line @typescript-eslint/no-var-requires

const app = express();
app.use(express.json());

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors());

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/diaries', diaryRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
