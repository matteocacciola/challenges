import * as bcrypt from 'bcrypt';

export const encrypt = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 6);
};

export const uniqueArray = <T>(arr: T[]): T[] => {
  return [...new Set(arr)];
};
