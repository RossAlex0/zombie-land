export interface IUser {
  email: string;
  birth_date?: string;
}

export interface IUserSignup extends IUser {
  first_name: string;
  last_name: string;

  password: string;
  confirmPassword: string;
}
