export interface UserProps {
  login: string;
  email: string;
  passwordHash: string;
  createdAt?: Date;
}

export class User {
  private readonly _id?: string;
  private readonly _login: string;
  private readonly _email: string;
  private readonly _passwordHash: string;
  private readonly _createdAt: Date;

  private constructor(props: UserProps, id?: string) {
    this._id = id;
    this._login = props.login;
    this._email = props.email;
    this._passwordHash = props.passwordHash;
    this._createdAt = props.createdAt || new Date();
  }

  static create(props: UserProps, id?: string): User {
    // Here we could add domain validation rules if needed
    return new User(props, id);
  }

  // Getters
  get id(): string | undefined {
    return this._id;
  }

  get login(): string {
    return this._login;
  }

  get email(): string {
    return this._email;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  // For serialization and data transfer
  toObject() {
    return {
      id: this._id,
      login: this._login,
      email: this._email,
      createdAt: this._createdAt
    };
  }
}
