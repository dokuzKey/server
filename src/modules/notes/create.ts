import { Request, Response } from 'express';
import User from '../../models/User';
import Note from '../../models/Note';
import { Types } from 'mongoose';
import thencrypt from 'thencrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface NoteCreateRequest extends Request {
  query: {
    token?: string;
    title?: string;
    body?: string;
  };
}

const notesCreate = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token, title, body } = req.body;
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
    if (!title || !body) {
      return res
        .status(400)
        .json({ status: false, message: 'Fill in all the fields' });
    }
    const encryptor = new thencrypt(process.env.ENCRYPTION_KEY as string);
    const encryptedBody = await encryptor.encrypt(body as string);
    const encryptedTitle = await encryptor.encrypt(title as string);

    const note = new Note({
      title: encryptedTitle,
      body: encryptedBody
    });
    await note.save();

    user.notes.push(note._id as Types.ObjectId);
    await user.save();
    return res
      .status(200)
      .json({ status: true, message: 'Note created successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res
      .status(500)
      .json({ status: false, message: 'Something failed in our end' });
  }
};

export default notesCreate;
