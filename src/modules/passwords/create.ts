import { Request, Response } from 'express';
import User from '../../models/User';
import Password from '../../models/Password';
import { Types } from 'mongoose';
import thencrypt from 'thencrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

interface PasswordCreateRequest extends Request {
  body: {
    token?: string;
    siteAddress?: string;
    username?: string;
    password?: string;
  };
}

const passwordsCreate = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { token, siteAddress, username, password } = req.body;
    if (!token) {
      return res
        .status(400)
        .json({ status: false, message: 'You are not authenticated' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await User.findOne({ email: (decoded as any).email });
    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }
    if (!siteAddress || !username || !password) {
      return res
        .status(400)
        .json({ status: false, message: 'Fill in all the fields' });
    }

    const encryptor = new thencrypt(process.env.ENCRYPTION_KEY as string);

    const encryptedUsername = await encryptor.encrypt(username as string);
    const encrypedSiteAddress = await encryptor.encrypt(siteAddress as string);
    const encryptedPass = await encryptor.encrypt(password as string);

    const newPassword = new Password({
      siteAddress: encrypedSiteAddress,
      username: encryptedUsername,
      password: encryptedPass
    });
    await newPassword.save();
    user.passwords.push(newPassword._id as Types.ObjectId);
    await user.save();
    return res
      .status(200)
      .json({ status: true, message: 'Password created successfully' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: 'Something failed in our end' });
  }
};

export default passwordsCreate;
