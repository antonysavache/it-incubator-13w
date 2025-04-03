import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';
import { UserMapper } from '../mappers/user.mapper';
import { User } from '../../domain/user.domain';
import { BaseCommandRepository } from '../../../../core/infrastructure/repositories/base-command.repository';

@Injectable()
export class UsersCommandRepository extends BaseCommandRepository<UserDocument, User> {
  constructor(
    @InjectModel('UserDocument') protected userModel: Model<UserDocument>,
    private userMapper: UserMapper
  ) {
    super(userModel);
  }

  toPersistence(user: User): any {
    return this.userMapper.toPersistence(user);
  }

  toDomain(document: UserDocument): User {
    return this.userMapper.toDomain(document);
  }

  /**
   * Find user by login
   * @param login User login
   * @returns User document or null if not found
   */
  async findByLogin(login: string): Promise<UserDocument | null> {
    return this.model.findOne({ login }).exec();
  }

  /**
   * Find user by email
   * @param email User email
   * @returns User document or null if not found
   */
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.model.findOne({ email }).exec();
  }
}
