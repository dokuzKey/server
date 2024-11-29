import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
dotenv.config();

import User from '../../models/User';

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

const login = async (req: LoginRequest, res: Response): Promise<Response> => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: false, message: 'You didn\t provide a valid form' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ status: false, message: 'User not found' });
  }
  const userPassword = user.password;
  if (!bcrypt.compare(password, userPassword)) {
    return res.status(401).json({ status: false, message: 'Invalid password' });
  }
  return res.status(200).json({
    status: true,
    token: jwt.sign({ email }, process.env.JWT_KEY as string)
  });
};

export default login;
