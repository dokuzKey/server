import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
const app = express();

app.use(helmet());
app.use(express.json());

// Password handlers
import passwordsGet from './modules/passwords/fetch';
import passwordsCreate from './modules/passwords/create';
// Note handlers
import notesGet from './modules/notes/fetch';
import notesCreate from './modules/notes/create';

// Database handler
import connectDB from './modules/database/connect';
connectDB();

// Authentication handlers
import register from './modules/auth/register';
import login from './modules/auth/login';

// Lister handlers
import listPasswords from './modules/listers/password';
import listNotes from './modules/listers/note';

app.all('/', (req: Request, res: Response) => {
  res.json({
    status: 1,
    message: "Why don't you try calling the API endpoints?"
  });
});

app.get('/api/fetch/:item', (req: Request, res: Response) => {
  if (req.params.item === 'passwords') {
    passwordsGet(req, res);
  } else if (req.params.item === 'notes') {
    notesGet(req, res);
  } else {
    return res.json({
      status: 0,
      message: 'Please call a valid API endpoint!'
    });
  }
});

app.post('/api/create/:item', (req: Request, res: Response) => {
  if (req.params.item === 'passwords') {
    passwordsCreate(req, res);
  } else if (req.params.item === 'notes') {
    notesCreate(req, res);
  } else {
    return res.json({
      status: 0,
      message: 'Please call a valid API endpoint!'
    });
  }
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  register(req, res);
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  login(req, res);
});

app.get('/api/list/:item', (req: Request, res: Response) => {
  if (req.params.item === 'passwords') {
    listPasswords(req, res);
  } else if (req.params.item === 'notes') {
    listNotes(req, res);
  } else {
    return res.json({
      status: 0,
      message: 'Please call a valid API endpoint!'
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log('Server is running on http://localhost:' + process.env.PORT);
});
