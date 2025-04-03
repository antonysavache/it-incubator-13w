import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseQueryRepository } from '../../../../core/infrastructure/repositories/base-query.repository';
import { UserDocument } from '../schemas/user.schema';
import { UserMapper } from '../mappers/user.mapper';
import { QueryParamsDto } from '../../../../core/dto/query-params.dto';
import { PaginatedResult } from '../../../../core/infrastructure/pagination';
import { ToResult } from '../../../../core/infrastructure/result';
import { ViewUserModel } from '../../models/user.models';
import { QueryParamsService } from '../../../../core/services/query-params.service';

@Injectable()
export class UsersQueryRepository extends BaseQueryRepository<UserDocument, ViewUserModel> {
  constructor(
    @InjectModel('UserDocument') protected userModel: Model<UserDocument>,
    private userMapper: UserMapper,
    protected queryParamsService: QueryParamsService
  ) {
    super(userModel, queryParamsService);
  }

  mapToView(entity: UserDocument): ViewUserModel {
    return this.userMapper.documentToView(entity);
  }

  async getUserById(id: string): Promise<ToResult<ViewUserModel>> {
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

  async findAll(params: QueryParamsDto): Promise<ToResult<PaginatedResult<ViewUserModel>>> {
    try {
      const { searchLoginTerm, searchEmailTerm } = params;
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