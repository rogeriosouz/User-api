import express from 'express';
import routes from './routes';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);

mongoose.connect(process.env.DATA_BASE as string)
  .then(() => {
    app.listen(process.env.DATA_PORT, () => {
      console.log('Server is runing..')
    })
  })
  .catch((err) => { console.log(err) })
