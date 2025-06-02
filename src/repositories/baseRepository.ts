import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";


class BaseRepository<T extends Document> {
    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async countDocuments(filter: FilterQuery<T> = {}): Promise<number> {
        try {
            return await this.model.countDocuments(filter);
        } catch (error) {
            console.error("Error in BaseRepository - countDocuments:", error);
            throw new Error("Failed to count documents");
        }
    }


    async create(data: Partial<T>): Promise<T> {
        try {
            const document = new this.model(data);
            return await document.save();
        } catch (error) {
            console.error("Error in BaseRepository - create:", error);
            throw new Error("Failed to create the document");
        }
    }

    async findById(id: string): Promise<T | null> {
        try {
            return await this.model.findById(id);
        } catch (error) {
            console.error("Error in BaseRepository - findById:", error);
            throw new Error("Failed to find the document by ID");
        }
    }


    async updateById(
        id: string,
        updateData: Partial<T>
    ): Promise<T | null> {
        try {
            return await this.model.findByIdAndUpdate(id, updateData, { new: true });
        } catch (error) {
            console.error("Error in BaseRepository - updateById:", error);
            throw new Error("Failed to update the document by ID");
        }
    }

    async deleteOne(query: FilterQuery<T>): Promise<{ deletedCount?: number }> {
        try {
            return await this.model.deleteOne(query);
        } catch (error) {
            console.error("Error in BaseRepository - deleteOne:", error);
            throw new Error("Failed to delete the document");
        }
    }

    async findOneAndUpdate(query: object, update: object, options: object) {
        try {
            return await this.model.findOneAndUpdate(query, update, options);
        } catch (error) {
            console.error("Error in findOneAndUpdate:", error);
            throw new Error("Failed to find and update the document");
        }
    }

    async findOne(query: FilterQuery<T>): Promise<T | null> {
        try {
            return await this.model.findOne(query);
        } catch (error) {
            console.error("Error in BaseRepository - findOne:", error);
            throw new Error("Failed to find the document");
        }
    }


    async updateOne(query: FilterQuery<T>, updateData: UpdateQuery<T>): Promise<T | null> {
        try {
            return await this.model.findOneAndUpdate(query, updateData, { new: true });
        } catch (error) {
            console.error("Error in BaseRepository - updateOne:", error);
            throw new Error("Failed to update the document");
        }
    }

    async find(query: FilterQuery<T>): Promise<T[]> {
        try {
            return await this.model.find(query);
        } catch (error) {
            console.error("Error in BaseRepository - find:", error);
            throw new Error("Failed to find documents");
        }
    }


    async findByIdAndDelete(id: string): Promise<T | null> {
        try {
            return await this.model.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error in BaseRepository - deleteById:", error);
            throw new Error("Failed to delete the document by ID");
        }
    }




}

export default BaseRepository;
