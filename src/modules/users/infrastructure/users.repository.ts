import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../domain/user.domain';
import { UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserDocument.name) private userModel: Model<UserDocument>,
  ) {}

  async save(user: User): Promise<User> {
    const userData = user.toObject();
    const newUser = new this.userModel(userData);
    const savedUser = await newUser.save();
    
    return User.create(
      {
        login: savedUser.login,
        email: savedUser.email,
        passwordHash: savedUser.passwordHash,
        createdAt: savedUser.createdAt,
        confirmationCode: savedUser.confirmationCode,
        emailConfirmed: savedUser.emailConfirmed
      },
      savedUser._id ? savedUser._id.toString() : undefined
    );
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) return null;
    
    return User.create(
      {
        login: user.login,
        email: user.email,
        passwordHash: user.passwordHash,
        createdAt: user.createdAt,
        confirmationCode: user.confirmationCode,
        emailConfirmed: user.emailConfirmed
      },
      user._id ? user._id.toString() : undefined
    );
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
    const user = await this.userModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }]
    }).exec();
    
    if (!user) return null;
    
    return User.create(
      {
        login: user.login,
        email: user.email,
        passwordHash: user.passwordHash,
        createdAt: user.createdAt,
        confirmationCode: user.confirmationCode,
        emailConfirmed: user.emailConfirmed
      },
      user._id ? user._id.toString() : undefined
    );
  }

  async findByConfirmationCode(code: string): Promise<User | null> {
    const user = await this.userModel.findOne({ confirmationCode: code }).exec();
    if (!user) return null;
    
    return User.create(
      {
        login: user.login,
        email: user.email,
        passwordHash: user.passwordHash,
        createdAt: user.createdAt,
        confirmationCode: user.confirmationCode,
        emailConfirmed: user.emailConfirmed
      },
      user._id ? user._id.toString() : undefined
    );
  }

  async confirmEmail(userId: string): Promise<boolean> {
    const result = await this.userModel.updateOne(
      { _id: userId },
      { $set: { emailConfirmed: true } }
    ).exec();
    
    return result.modifiedCount > 0;
  }

  async updateConfirmationCode(userId: string, confirmationCode: string): Promise<boolean> {
    const result = await this.userModel.updateOne(
      { _id: userId },
      { $set: { confirmationCode } }
    ).exec();
    
    return result.modifiedCount > 0;
  }

  async findAll(pageNumber: number = 1, pageSize: number = 10): Promise<{ items: User[], totalCount: number }> {
    const skip = (pageNumber - 1) * pageSize;
    
    const [users, totalCount] = await Promise.all([
      this.userModel.find().skip(skip).limit(pageSize).exec(),
      this.userModel.countDocuments()
    ]);
    
    const items = users.map(user => 
      User.create(
        {
          login: user.login,
          email: user.email,
          passwordHash: user.passwordHash,
          createdAt: user.createdAt,
          confirmationCode: user.confirmationCode,
          emailConfirmed: user.emailConfirmed
        },
        user._id ? user._id.toString() : undefined
      )
    );
    
    return { items, totalCount };
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}