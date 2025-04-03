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

  getEntityId(user: User): string | undefined {
    return user.id;
  }

  async findByLogin(login: string): Promise<UserDocument | null> {
    return this.model.findOne({ login }).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.model.findOne({ email }).exec();
  }
}
