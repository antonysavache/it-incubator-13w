import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsCommandRepository } from './blogs/infrastructure/repositories/blogs-command.repository';
import { BlogsQueryRepository } from './blogs/infrastructure/repositories/blogs-query.repository';
import { BlogDocument, BlogSchema } from './blogs/infrastructure/schemas/blog.schema';
import { BlogMapper } from './blogs/infrastructure/mappers/blog.mapper';

const repositories = [
  BlogsCommandRepository,
  BlogsQueryRepository
];

const mappers = [
  BlogMapper
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'BlogDocument', schema: BlogSchema }
    ])
  ],
  providers: [
    ...mappers,
    ...repositories
  ],
  exports: [
    ...mappers,
    ...repositories
  ]
})
export class BlogsRepositoryModule {}
