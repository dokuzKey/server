import { Request, Response } from 'express';
import thencrypt from 'thencrypt';
import User from '../../models/User';
import Password from '../../models/Password';

interface UserType {
  token: string;
  passwords: { _id: string }[];
}

interface PasswordType {
  siteAddress: string;
  siteAdress: string;
  username: string;
  password: string;
  url: string;
  createdAt: Date;
  _id: string;
}

const passwordsGet = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token } = req.body;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ status: 0, message: 'Token is required' });
    }
    const user: UserType | null = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ status: 0, message: 'User not found' });
    }
    const encryptor = new thencrypt(token);
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

    return res.status(200).json({ status: 1, data: passwordDataById });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 0, message: 'Internal Server Error' });
  }
};

export default passwordsGet;
