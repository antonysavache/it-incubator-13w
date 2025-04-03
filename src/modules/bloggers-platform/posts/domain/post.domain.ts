export interface PostProps {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt?: Date;
}

export class Post {
  private readonly _id?: string;
  private readonly _title: string;
  private readonly _shortDescription: string;
  private readonly _content: string;
  private readonly _blogId: string;
  private readonly _blogName: string;
  private readonly _createdAt: Date;

  private constructor(props: PostProps, id?: string) {
    this._id = id;
    this._title = props.title;
    this._shortDescription = props.shortDescription;
    this._content = props.content;
    this._blogId = props.blogId;
    this._blogName = props.blogName;
    this._createdAt = props.createdAt || new Date();
  }

  static create(props: PostProps, id?: string): Post {
    // Here we could add domain validation rules if needed
    return new Post(props, id);
  }

  // Getters
  get id(): string | undefined {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get shortDescription(): string {
    return this._shortDescription;
  }

  get content(): string {
    return this._content;
  }

  get blogId(): string {
    return this._blogId;
  }

  get blogName(): string {
    return this._blogName;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  // For serialization and data transfer
  toObject() {
    return {
      id: this._id,
      title: this._title,
      shortDescription: this._shortDescription,
      content: this._content,
      blogId: this._blogId,
      blogName: this._blogName,
      createdAt: this._createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
        newestLikes: []
      }
    };
  }
}
