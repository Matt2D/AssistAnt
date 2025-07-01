export type PasswordUser = {
  username: string;
  id: string;
  password: string;
  email?: string;
};

export type User = Omit<PasswordUser, 'password'>;