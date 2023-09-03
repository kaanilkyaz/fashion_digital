import express from 'express';
import { evaluationRouter } from './routes/evaluation';

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/evaluation', evaluationRouter);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
