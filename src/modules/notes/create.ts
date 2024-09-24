import { Request, Response } from 'express';
import User from '../../models/User';
import Note from '../../models/Note';
import { Types } from 'mongoose';
import thencrypt from 'thencrypt';

interface NoteCreateRequest extends Request {
  query: {
    token?: string;
    title?: string;
    body?: string;
  };
}

const notesCreate = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token, title, body } = req.query;
    if (!token) {
      return res.status(400).json({ status: 0, message: 'Token is required' });
    }
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ status: 0, message: 'User not found' });
    }
    if (!title || !body) {
      return res
        .status(400)
        .json({ status: 0, message: 'Fill in all the fields' });
    }
    const encryptor = new thencrypt(token as string);
    const encryptedBody = await encryptor.encrypt(body as string);

    const note = new Note({
      title,
      body: encryptedBody
    });
    await note.save();

    user.notes.push(note._id as Types.ObjectId);
    await user.save();
    return res
      .status(200)
      .json({ status: 1, message: 'Note created successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res
      .status(500)
      .json({ status: 0, message: 'Internal Server Error' });
  }
};

export default notesCreate;
