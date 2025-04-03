import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseQueryRepository } from '../../../../core/infrastructure/repositories/base-query.repository';
import { UserDocument } from '../schemas/user.schema';
import { UserView } from '../../domain/models/user-view.interface';
import { UserMapper } from '../mappers/user.mapper';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';
import { PaginatedResult } from '../../../../core/infrastructure/pagination';
import { ToResult } from '../../../../core/infrastructure/result';

@Injectable()
export class UsersQueryRepository extends BaseQueryRepository<UserDocument, UserView> {
  constructor(
    @InjectModel('UserDocument') protected userModel: Model<UserDocument>,
    private userMapper: UserMapper
  ) {
    super(userModel);
  }

  mapToView(entity: UserDocument): UserView {
    return this.userMapper.documentToView(entity);
  }

  // Overload with a separate method name to avoid conflicts with BaseQueryRepository
  async getUserById(id: string): Promise<ToResult<UserView>> {
    try {
      const user = await super.findById(id);
      
      if (!user) {
        return ToResult.fail(`User with id ${id} not found`);
      }
      
      return ToResult.ok(this.mapToView(user));
    } catch (error) {
      return ToResult.fail(error.message || 'Unknown error');
    }
  }

  async findAll(params: BaseQueryParams): Promise<ToResult<PaginatedResult<UserView>>> {
    try {
      const { searchLoginTerm, searchEmailTerm } = params as any;
      let filter: any = {};
      
      if (searchLoginTerm || searchEmailTerm) {
        filter = {
          $or: []
        };
        
        if (searchLoginTerm) {
          filter.$or.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
        }
        
        if (searchEmailTerm) {
          filter.$or.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
        }
      }
      
      const searchFields: string[] = [];
      const result = await super.getAllWithPagination(params, searchFields, filter);
      
      return ToResult.ok(result);
    } catch (error) {
      return ToResult.fail(error.message || 'Unknown error');
    }
  }
}
