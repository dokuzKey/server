import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import bip39 from 'bip39';
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
  const { email, password } = req.body as {
    email: string;
    password: string;
  };
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: false, message: 'Please fill all fields' });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: 'This email is already in use' });
    }

    const passphrase = bip39.generateMnemonic(128).replace(/ /g, '-');
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email }, process.env.JWT_KEY as string);
    const encryptor = new thencrypt(passphrase);
    const serverEncryptor = new thencrypt(process.env.ENCRYPTION_KEY as string);

    /* From here, the encryption process looks like shit. I am sorry. */
    /* This will encrypt the data with the server-side encryption key, after user's key is used. */

    const encryptedPassword = await serverEncryptor.encrypt(
      await encryptor.encrypt(password)
    );
    const encryptedEmail = await serverEncryptor.encrypt(
      await encryptor.encrypt(email)
    );

    const newPassword = new Password({
      siteAddress: serverEncryptor
        .encrypt(await encryptor.encrypt(process.env.SITEADDRESS as string))
        .toString()
        .toString(),
      username: encryptedEmail,
      password: encryptedPassword
    });

    const encryptedBody = await serverEncryptor.encrypt(
      await encryptor.encrypt("This is an example note. It's encrypted.")
    );
    const encryptedTitle = await serverEncryptor.encrypt(
      await encryptor.encrypt('This is an example note.')
    );

    const newNote = new Note({
      title: encryptedTitle,
      body: encryptedBody
    });

    const newUser = new User({
      email,
      password: hashedPassword,
      token
    });

    await newPassword.save();
    await newNote.save();

    newUser.passwords.push(newPassword._id as Types.ObjectId);
    newUser.notes.push(newNote._id as Types.ObjectId);
    await newUser.save();
    return res.status(200).json({ status: true, token, passphrase });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: 'Registration failed' });
  }
};

export default register;
