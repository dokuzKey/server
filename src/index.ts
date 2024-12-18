import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response } from 'express';
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

/* Password handlers */
import passwordsGet from './modules/passwords/fetch';
import passwordsCreate from './modules/passwords/create';
import passwordsDelete from './modules/passwords/delete';
import passwordsEdit from './modules/passwords/edit';

/* Note handlers */
import notesGet from './modules/notes/fetch';
import notesCreate from './modules/notes/create';
import notesDelete from './modules/notes/delete';
import notesEdit from './modules/notes/edit';

/* Authentication handlers */
import register from './modules/auth/register';
import login from './modules/auth/login';

bootCheck(); // Check the configuration values

app.all('/', (req, res) => {
  res.status(200).json(validEndpoints);
});

app.post('/fetch/:item', (req: Request, res: Response) => {
  if (req.params.item === 'passwords') {
    return passwordsGet(req, res);
  } else if (req.params.item === 'notes') {
    return notesGet(req, res);
  } else {
    return res.json({
      status: false,
      message: 'Please call a valid API endpoint'
    });
  }
});

app.post('/create/:item', (req: Request, res: Response) => {
  if (req.params.item === 'passwords') {
    return passwordsCreate(req, res);
  } else if (req.params.item === 'notes') {
    return notesCreate(req, res);
  } else {
    return res.json({
      status: false,
      message: 'Please call a valid API endpoint'
    });
  }
});

app.delete('/delete/:item', (req: Request, res: Response) => {
  if (req.params.item === 'passwords') {
    return passwordsDelete(req, res);
  } else if (req.params.item === 'notes') {
    return notesDelete(req, res);
  } else {
    return res.json({
      status: false,
      message: 'Please call a valid API endpoint'
    });
  }
});

app.patch('/edit/:item', (req: Request, res: Response) => {
  if (req.params.item === 'passwords') {
    return passwordsEdit(req, res);
  } else if (req.params.item === 'notes') {
    return notesEdit(req, res);
  } else {
    return res.json({
      status: false,
      message: 'Please call a valid API endpoint'
    });
  }
});

app.post('/auth/:item', (req: Request, res: Response) => {
  if (req.params.item === 'register') {
    return register(req, res);
  }
  if (req.params.item === 'login') {
    return login(req, res);
  } else {
    return res.json({
      status: false,
      message: 'Please call a valid API endpoint'
    });
  }
});

app.listen(config.port, () => {
  console.log(`🚀 Server is running on port ${config.port}!`);
});
