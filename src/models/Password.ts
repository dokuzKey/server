import mongoose, { Document, Schema } from 'mongoose';

interface IPassword extends Document {
  siteAdress: string;
  username: string;
  password: string;
  createdAt: Date;
}

const passwordSchema: Schema = new Schema({
  siteAdress: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true
  }
});

const Password = mongoose.model<IPassword>('Password', passwordSchema);

export default Password;
