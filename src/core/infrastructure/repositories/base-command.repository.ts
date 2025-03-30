// import {Collection, Filter, ObjectId, OptionalUnlessRequiredId, UpdateFilter} from 'mongodb';
// import {getDatabase} from "../db/mongo-db";
// import { InjectModel } from '@nestjs/mongoose';
// import { User, UserModelType } from '../../../modules/user-accounts/domain/user.entity';
//
// export abstract class BaseCommandRepository<ModelName, CreateModel> {
//   constructor(@InjectModel(User.name) private model: T) {}
//
//   init() {
//     if (!this.collection) {
//       this.collection = getDatabase().collection<T>(this.collectionName);
//     }
//   }
//
//   protected checkInit() {
//     if (!this.collection) {
//       throw new Error('Repository not initialized');
//     }
//   }
//
//   async update(id: string, data: Partial<CreateModel>): Promise<boolean> {
//     this.checkInit();
//
//     const result = await this.collection.updateOne(
//       { _id: new ObjectId(id) } as Filter<T>,
//       { $set: data } as UpdateFilter<T>
//     );
//
//     return result.matchedCount === 1;
//   }
//
//   async delete(id: string): Promise<boolean> {
//     this.checkInit();
//
//     const result = await this.collection.deleteOne(
//       { _id: new ObjectId(id) } as Filter<T>
//     );
//
//     return result.deletedCount === 1;
//   }
//
//   async deleteAll(): Promise<void> {
//     this.checkInit();
//     await this.collection.deleteMany({});
//   }
// }
