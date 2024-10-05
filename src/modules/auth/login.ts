import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import User from '../../models/User';

interface LoginRequest extends Request {
  query: {
    username: string;
    password: string;
  };
}

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body as {
      username: string;
      password: string;
    };
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ code: 0, message: 'User not found' });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ code: 0, message: 'Invalid password' });
      return;
    }
    res
      .status(200)
      .json({ code: 1, message: 'Login successful', token: user.token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 0, message: 'Internal server error' });
  }
};

export default login;
