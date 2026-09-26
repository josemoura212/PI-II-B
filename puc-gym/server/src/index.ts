import cors from 'cors';
import express from 'express';
import { router } from './routes';

const port = Number(process.env.PORT ?? 3333);

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.get('/', (_req, res) => {
  res.json({ name: 'PUC Gym API', status: 'ok' });
});
app.use('/api', router);

app.listen(port, () => {
  console.log(`PUC Gym API no ar em http://localhost:${port}`);
});
