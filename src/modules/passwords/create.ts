import { Request, Response } from 'express';
import User from '../../models/User';
import Password from '../../models/Password';
import { Types } from 'mongoose';
import thencrypt from 'thencrypt';

interface PasswordCreateRequest extends Request {
  query: {
    token?: string;
    siteAdress?: string;
    username?: string;
    password?: string;
  };
}

const passwordsCreate = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { token, siteAdress, username, password } = req.query;
    if (!token) {
      return res.status(400).json({ status: 0, message: 'Token is required' });
    }
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ status: 0, message: 'User not found' });
    }
    if (!siteAdress || !username || !password) {
      return res
        .status(400)
        .json({ status: 0, message: 'Fill in all the fields' });
    }

    const encryptor = new thencrypt(token as string);
    const encryptedPass = await encryptor.encrypt(password as string);

    const newPassword = new Password({
      siteAdress,
      username,
      password: encryptedPass
    });
    await newPassword.save();
    user.passwords.push(newPassword._id as Types.ObjectId);
    await user.save();
    return res
      .status(200)
      .json({ status: 1, message: 'Password created successfully' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 0, message: 'Internal Server Error' });
  }
};

export default passwordsCreate;
