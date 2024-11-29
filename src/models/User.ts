import mongoose, { Document, Schema, Model, model } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
  creationDate: Date;
  passwords: mongoose.Types.ObjectId[];
  notes: mongoose.Types.ObjectId[];
}

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    default: Date.now(),
    required: true
  },
  passwords: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Password'
    }
  ],
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ]
});

const User: Model<IUser> = model<IUser>('User', userSchema);

export default User;
