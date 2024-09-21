import { Schema, model, Document } from 'mongoose';

interface INote extends Document {
  title: string;
  body: string;
  createdAt: Date;
}

const noteSchema = new Schema<INote>({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Note = model<INote>('Note', noteSchema);

export default Note;
