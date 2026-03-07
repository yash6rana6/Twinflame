import bcrypt from 'bcryptjs';
import User from '@/models/User';

export const registerService = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new Error('ALL_FIELDS_REQUIRED');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('USER_EXISTS');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'user',
  });

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
};
