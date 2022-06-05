import mongoose from 'mongoose';

type User = {
  name: string,
  email: string,
  password: string,
}

const schema = new mongoose.Schema<User>({
  name: String,
  email: String,
  password: String,
})

const User = mongoose.model<User>('users', schema);

export default User;