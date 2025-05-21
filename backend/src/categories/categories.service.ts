import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, isValidObjectId } from "mongoose";

import { Category } from "./schemas/category.schema";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { SearchCategoryDto } from "./dto/search-category.dto";
import { PaginationDto } from "src/common/dto/pagination-dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";


@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

    async create(userId: string, dto: CreateCategoryDto) {
        return this.categoryModel.create({ ...dto, userId });
    }

    async findAll(searchDto: SearchCategoryDto, paginationDto: PaginationDto) {
        const { name, type} = searchDto;
      
        const filter: any = {};

        if(name){
            filter.name = { $regex: name, $options: 'i'};
        }

        if(type){
            filter.type = { $regex: type, $options: 'i'};
        }

        const { page, limit = 10 } = paginationDto;

        const query = this.categoryModel.find(filter);

        //handle without pagination
        if (!page) {
            const categories = await query.exec();
            return { data: categories };
        }

        //handle witho pagination

        const skip = (Number(page) - 1) * Number(limit);

        const [categories, total] = await Promise.all([
            query.skip(skip).limit(Number(limit)).exec(),
            this.categoryModel.countDocuments(filter),
        ]);

        return {
            data: categories,
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
        };
    }

    async update(id: string, dto: UpdateCategoryDto) {
        const updatedCategory = this.categoryModel.findOneAndUpdate(
            { _id: id},
            dto,
            { new: true },
        );

        if (!updatedCategory) {
            throw new NotFoundException("Category not found");
        }

        return  updatedCategory;
    }

    async findOne(id: string) {
        if (!isValidObjectId(id)) {
        throw new BadRequestException("Invalid category ID format");
        }
    
        const category = await this.categoryModel.findOne({ _id: id});
    
        if (!category) {
            throw new NotFoundException("Category not found");
        }
    
        return category;
    }

    async findOrCreateCategory(userId: string, name: string, type: string) {
        let category = await this.categoryModel.findOne({ name, userId });
        if (!category) {
        category = await this.categoryModel.create({
            name,
            type,
            userId,
        });
        }
        return category;
    }

    async remove(id: string) {
        const deletedCategory = await  this.categoryModel.findOneAndDelete({ _id: id});

        if (!deletedCategory) {
            throw new NotFoundException("Category not found");
        }

        return { message: 'Account deleted successfully' };
    }
}
