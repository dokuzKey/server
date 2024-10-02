import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import User from '../../models/User';
import Password from '../../models/Password';
import Note from '../../models/Note';
import dotenv from 'dotenv';
import { Types } from 'mongoose';
import thencrypt from 'thencrypt';

dotenv.config();

interface RegisterRequest extends Request {
  query: {
    username?: string;
    email?: string;
    password?: string;
  };
}

const register = async (req: Request, res: Response): Promise<Response> => {
  const { username, email, password } = req.query as {
    username: string;
    email: string;
    password: string;
  };
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ status: 0, message: 'Please fill all fields' });
  }
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: 0, message: 'This username/email is already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = await bcrypt.hash(hashedPassword, 10);
    const encryptor = new thencrypt(token);

    const encryptedPassword = await encryptor.encrypt(password);
    const newPassword = new Password({
      siteAdress: process.env.SITEADRESS,
      username,
      password: encryptedPassword
    });

    const encryptedBody = await encryptor.encrypt(
      `This is an example note. It's encrypted.`
    ); // Await encryption

    const newNote = new Note({
      title: 'This is an example note.',
      body: encryptedBody
    });

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      token
    });

    await newPassword.save();
    await newNote.save();

    newUser.passwords.push(newPassword._id as Types.ObjectId);
    newUser.notes.push(newNote._id as Types.ObjectId);
    await newUser.save();
    return res.status(200).json({ status: 1, token });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 0, message: 'Registration failed', code: error });
  }
};

export default register;
