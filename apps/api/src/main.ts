import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { PORT } from './configs/env.config';
import errorMiddleware from './middlewares/error.middleware';
import router from './routers';

const app = express();

// middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// routers
app.use('/api', router);

// error middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
