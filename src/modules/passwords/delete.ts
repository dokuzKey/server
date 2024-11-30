import { Request, Response } from 'express';
import User from '../../models/User';
import Password from '../../models/Password';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const passwordsDelete = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { token, passwordId } = req.body;
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
      return res
        .status(403)
        .json({
          status: false,
          message: 'You do not have permission to delete this password'
        });
    }

    await Password.deleteOne({ _id: passwordObjectId });
    user.passwords = user.passwords.filter(
      (id) => !id.equals(passwordObjectId)
    );
    await user.save();

    return res
      .status(200)
      .json({ status: true, message: 'Password deleted successfully' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: 'Something failed in our end' });
  }
};

export default passwordsDelete;
