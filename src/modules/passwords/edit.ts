import { Request, Response } from 'express';
import User from '../../models/User';
import Password from '../../models/Password';
import { Types } from 'mongoose';
import thencrypt from 'thencrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const passwordsEdit = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { token, passwordId, siteAddress, username, password } = req.body;
    if (!token) {
      return res
        .status(400)
        .json({ status: false, message: 'You are not authenticated' });
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY as string);
    const user = await User.findOne({ email: (decoded as any).email });
    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }
    if (!passwordId) {
      return res
        .status(400)
        .json({ status: false, message: 'Password ID is required' });
    }

    const passwordObjectId = new Types.ObjectId(passwordId);
    if (!user.passwords.includes(passwordObjectId)) {
      return res.status(403).json({
        status: false,
        message: 'You do not have permission to edit this password'
      });
    }

    const passwordEntry = await Password.findById(passwordObjectId);
    if (!passwordEntry) {
      return res
        .status(404)
        .json({ status: false, message: 'Password not found' });
    }

    const encryptor = new thencrypt(process.env.ENCRYPTION_KEY as string);

    if (siteAddress) {
      passwordEntry.siteAddress = await encryptor.encrypt(siteAddress);
    }
    if (username) {
      passwordEntry.username = await encryptor.encrypt(username);
    }
    if (password) {
      passwordEntry.password = await encryptor.encrypt(password);
    }

    await passwordEntry.save();

    return res
      .status(200)
      .json({ status: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: 'Something failed in our end' });
  }
};

export default passwordsEdit;
