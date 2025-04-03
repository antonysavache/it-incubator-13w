import { Model, Document } from 'mongoose';

export abstract class BaseCommandRepository<T extends Document, E> {
  constructor(protected model: Model<T>) {}

  /**
   * Abstract method to convert a domain entity to a persistence model
   * @param entity Domain entity
   */
  abstract toPersistence(entity: E): any;

  /**
   * Abstract method to convert a persistence model to a domain entity
   * @param document MongoDB document
   */
  abstract toDomain(document: T): E;

  /**
   * Save entity (create or update)
   * @param entity Domain entity
   * @returns Saved document
   */
  async save(entity: E, id?: string): Promise<T> {
    const persistenceData = this.toPersistence(entity);
    
    if (id) {
      // Update existing entity
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
      // Create new entity
      const newEntity = new this.model(persistenceData);
      return newEntity.save();
    }
  }

  /**
   * Delete entity by ID
   * @param id Entity ID
   * @returns true if deleted, false if not found
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}
