export interface BlogProps {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt?: Date;
}

export class Blog {
  private readonly _id?: string;
  private readonly _name: string;
  private readonly _description: string;
  private readonly _websiteUrl: string;
  private readonly _createdAt: Date;

  private constructor(props: BlogProps, id?: string) {
    this._id = id;
    this._name = props.name;
    this._description = props.description;
    this._websiteUrl = props.websiteUrl;
    this._createdAt = props.createdAt || new Date();
  }

  static create(props: BlogProps, id?: string): Blog {
    // Here we could add domain validation rules if needed
    return new Blog(props, id);
  }

  // Getters
  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get websiteUrl(): string {
    return this._websiteUrl;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  // For serialization and data transfer
  toObject() {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      websiteUrl: this._websiteUrl,
      createdAt: this._createdAt
    };
  }
}
