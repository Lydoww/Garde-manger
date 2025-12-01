import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from '@/routes/index';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use('/api', routes);

app.use(errorMiddleware);

export default app;
