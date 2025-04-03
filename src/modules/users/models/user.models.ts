export interface CreateUserModel {
  login: string;
  password: string;
  email: string;
}

export interface ViewUserModel {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}
