import { Request, Response } from 'express';
import User from '../../models/User';
import Note from '../../models/Note';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const notesDelete = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token, noteId } = req.body;
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

    if (!noteId) {
      return res
        .status(400)
        .json({ status: false, message: 'Note ID is required' });
    }

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ status: false, message: 'Note not found' });
    }

    if (!user.notes.includes(noteId)) {
      return res
        .status(403)
        .json({ status: false, message: 'Not authorized to delete this note' });
    }

    await Note.findByIdAndDelete(noteId);
    user.notes = user.notes.filter(
      (id: Types.ObjectId) => id.toString() !== noteId
    );
    await user.save();

    return res
      .status(200)
      .json({ status: true, message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res
      .status(500)
      .json({ status: false, message: 'Something failed in our end' });
  }
};

export default notesDelete;
