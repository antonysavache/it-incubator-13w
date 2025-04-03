import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user.domain';
import { UserDocument } from '../schemas/user.schema';
import { UserView } from '../../domain/models/user-view.interface';

@Injectable()
export class UserMapper {
  // Map from domain to persistence
  toPersistence(user: User): any {
    return {
      login: user.login,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt
    };
  }

  // Map from persistence to domain
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

  // Map from domain to view model
  toView(user: User): UserView {
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

  // Map from persistence directly to view model
  documentToView(userDocument: UserDocument): UserView {
    return {
      id: userDocument._id?.toString() || '',
      login: userDocument.login,
      email: userDocument.email,
      createdAt: userDocument.createdAt.toISOString()
    };
  }
}
