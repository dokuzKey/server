import { Request, Response } from 'express';
import thencrypt from 'thencrypt';
import User from '../../models/User';
import Note from '../../models/Note';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface UserDocument {
  token: string;
  notes: { _id: string }[];
}

interface NoteDocument {
  _id: string;
  body: string;
  title: string;
  createdAt: Date;
  [key: string]: any;
}

const notesGet = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token } = req.body;
    if (!token) {
      return res
        .status(400)
        .json({ status: false, message: 'You are not authenticated' });
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY as string);
    const user: UserDocument | null = await User.findOne({
      email: (decoded as any).email
    });
    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }

    const encryptor = new thencrypt(process.env.ENCRYPTION_KEY as string);
    const noteIds = user.notes.map((note) => note._id);
    const notes = (await Note.find({
      _id: { $in: noteIds }
    }).lean()) as unknown as NoteDocument[];
    const decryptedNotes = await Promise.all(
      notes.map(async (note) => {
        const decryptedTitle = await encryptor.decrypt(note.title);
        const decryptedContent = await encryptor.decrypt(note.body);
        return {
          _id: note._id,
          id: note._id,
          title: decryptedTitle.toString(),
          body: decryptedContent.toString(),
          createdAt: note.createdAt
        };
      })
    );

    const notesById = decryptedNotes.reduce(
      (acc, note) => {
        acc[note.id] = note;
        return acc;
      },
      {} as { [key: string]: NoteDocument }
    );

    return res.status(200).json({ status: true, data: notesById });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: 'Something failed in our end' });
  }
};

export default notesGet;
