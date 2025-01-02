export type User = {
  id: number;
  email: string;
  password: string;
};

export type Training = {
  id: number;
  title: string;
  image: string;
  description: string;
};

export type Session = {
  id: string;
  expiresAt: number;
  userId: number;
};
