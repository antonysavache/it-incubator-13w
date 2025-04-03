import { Model, Document } from 'mongoose';

export abstract class BaseCommandRepository<T extends Document, E> {
  constructor(protected model: Model<T>) {}

  abstract toPersistence(entity: E): any;
  abstract toDomain(document: T): E;
  abstract getEntityId(entity: E): string | undefined;

  async save(entity: E): Promise<T> {
    const persistenceData = this.toPersistence(entity);
    const id = this.getEntityId(entity);
    
    if (id) {
      const updated = await this.model.findByIdAndUpdate(
        id,
        persistenceData,
        { new: true }
      ).exec();
      
      if (!updated) {
        throw new Error(`Entity with id ${id} not found`);
      }
      
      return updated;
    } else {
      const newEntity = new this.model(persistenceData);
      return newEntity.save();
    }
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}
