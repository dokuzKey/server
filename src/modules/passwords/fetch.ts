import { Request, Response } from 'express';
import thencrypt from 'thencrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../../models/User';
import Password from '../../models/Password';
dotenv.config();

interface UserType {
  token: string;
  passwords: { _id: string }[];
}

interface PasswordType {
  siteAddress: string;
  username: string;
  password: string;
  createdAt: Date;
  _id: string;
}

const passwordsGet = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token } = req.body;
    if (!token) {
      return res
        .status(400)
        .json({ status: false, message: 'You are not authenticated' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const user: UserType | null = await User.findOne({
      email: (decoded as any).email
    });
    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }
    const encryptor = new thencrypt(process.env.ENCRYPTION_KEY as string);
    const passwordIds = user.passwords.map((password) => password._id);
    const passwords: PasswordType[] = await Password.find({
      _id: { $in: passwordIds }
    });

    const passwordData = await Promise.all(
      passwords.map(async (password) => {
        const decryptedSiteAddress = await encryptor.decrypt(
          password.siteAddress
        );
        const decryptedUsername = await encryptor.decrypt(password.username);
        const decryptedPassword = await encryptor.decrypt(password.password);
        return {
          id: password._id,
          siteAddress: decryptedSiteAddress.toString(),
          username: decryptedUsername.toString(),
          password: decryptedPassword.toString(),
          createdAt: password.createdAt
        };
      })
    );

    const passwordDataById = passwordData.reduce(
      (acc, password) => {
        acc[password.id] = password;
        return acc;
      },
      {} as Record<string, any>
    );

    return res.status(200).json({ status: true, data: passwordDataById });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: 'Something failed in our end' });
  }
};

export default passwordsGet;
