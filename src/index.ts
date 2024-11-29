import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import config from '../config';
import fs from 'fs';
import path from 'path';
dotenv.config();

// Import the boot checker to validate the configuration values
import bootCheck from './init/validity';

const validEndpoints = JSON.parse(
  /* I am really sorry, but I had to do this manually. (Check the file) ^-^ */
  fs.readFileSync(path.join(__dirname, 'validEndpoints.json'), 'utf-8')
);

const app = express();
app.use(cors());
app.use(express.json());

bootCheck(); // Check the configuration values

app.all('/', (req, res) => {
  res.status(200).json(validEndpoints);
});

app.listen(config.port, () => {
  console.log(`🚀 Server is running on port ${config.port}!`);
});
