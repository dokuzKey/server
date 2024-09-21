import { Request, Response } from 'express';
import User from '../../models/User';
import Password from '../../models/Password';

interface UserType {
  token: string;
  passwords: { _id: string }[];
}

interface PasswordType {
  _id: string;
}

const passwordsGet = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ status: 0, message: 'Token is required' });
    }
    const user: UserType | null = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ status: 0, message: 'User not found' });
    }
    const passwordIds = user.passwords.map((password) => password._id);
    const passwords: PasswordType[] = await Password.find({
      _id: { $in: passwordIds }
    });
    return res.status(200).json({ status: 1, passwords });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 0, message: 'Internal Server Error' });
  }
};

export default passwordsGet;
