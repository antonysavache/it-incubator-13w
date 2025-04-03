import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';
import { UserMapper } from '../mappers/user.mapper';
import { User } from '../../domain/user.domain';

@Injectable()
export class UsersCommandRepository {
  constructor(
    @InjectModel('UserDocument') private userModel: Model<UserDocument>,
    private userMapper: UserMapper
  ) {}

  async save(user: User): Promise<UserDocument> {
    const persistenceData = this.userMapper.toPersistence(user);
    
    if (user.id) {
      // Update existing user
      const updated = await this.userModel.findByIdAndUpdate(
        user.id,
        persistenceData,
        { new: true }
      ).exec();
      
      if (!updated) {
        throw new Error(`User with id ${user.id} not found`);
      }
      
      return updated;
    } else {
      // Create new user
      const newUser = new this.userModel(persistenceData);
      return newUser.save();
    }
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async findByLogin(login: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ login }).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
