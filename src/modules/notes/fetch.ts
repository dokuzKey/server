import { Request, Response } from 'express';
import thencrypt from 'thencrypt';
import User from '../../models/User';
import Note from '../../models/Note';

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
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ status: 0, message: 'Token is required' });
    }
    const user: UserDocument | null = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ status: 0, message: 'User not found' });
    }

    const encryptor = new thencrypt(token);
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

    return res.status(200).json({ status: 1, data: notesById });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 0, message: 'Internal Server Error' });
  }
};

export default notesGet;
