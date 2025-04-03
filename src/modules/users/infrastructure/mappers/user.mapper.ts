import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user.domain';
import { UserDocument } from '../schemas/user.schema';
import { ViewUserModel } from '../../models/user.models';

@Injectable()
export class UserMapper {
  toPersistence(user: User): any {
    return {
      login: user.login,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt
    };
  }

  toDomain(userDocument: UserDocument): User {
    return User.create(
      {
        login: userDocument.login,
        email: userDocument.email,
        passwordHash: userDocument.passwordHash,
        createdAt: userDocument.createdAt
      },
      userDocument._id?.toString()
    );
  }

  toView(user: User): ViewUserModel {
    if (!user.id) {
      throw new Error('User ID is required for view model');
    }

    return {
      id: user.id,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt.toISOString()
    };
  }

  documentToView(userDocument: UserDocument): ViewUserModel {
    return {
      id: userDocument._id?.toString() || '',
      login: userDocument.login,
      email: userDocument.email,
      createdAt: userDocument.createdAt.toISOString()
    };
  }
}