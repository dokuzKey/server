import { Request, Response } from 'express';
import User from '../../models/User';
import Note from '../../models/Note';

interface UserDocument {
  token: string;
  notes: { _id: string }[];
}

interface NoteDocument {
  _id: string;
}

const notesGet = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ status: 0, message: 'Token is required' });
    }

    const user: UserDocument | null = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ status: 0, message: 'User not found' });
    }

    const noteIds = user.notes.map((note) => note._id);
    const notes: NoteDocument[] = await Note.find({ _id: { $in: noteIds } });
    return res.status(200).json({ status: 1, notes });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 0, message: 'Internal Server Error' });
  }
};

export default notesGet;
