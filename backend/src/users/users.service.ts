import { BadRequestException, Injectable, NotFoundException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { PaginationDto } from 'src/common/dto/pagination-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}


  async findAll(searchDto: SearchUserDto, paginationDto: PaginationDto) {
      const { name, email } = searchDto;
      const { page = 1, limit = 10 } = paginationDto;

      const skip = (Number(page) - 1) * Number(limit);

      const filter: any = {};

      if(name){
        filter.name = { $regex: name, $options: 'i'};
      }

      if(email){
        filter.email = { $regex: email, $options: 'i'};
      }

      const [ users, total ] = await Promise.all([
        this.userModel.find(filter).skip(skip).limit(limit),
        this.userModel.countDocuments(filter),
      ]);

      return {
          data: users,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
      }

  }

  async findByEmail(email: string) {
    const user = this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id).select('-password');// ambil data user kecuali password
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // Register user
  async create(createUserDto: CreateUserDto): Promise< User > {
      const { email, password, name } = createUserDto;
  
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        throw new BadRequestException('Email sudah digunakan');
      }
  
      const hashedPassword = await this.encryptPassword(password);
  
      const user = new this.userModel({
        name,
        email,
        password: hashedPassword,
        role: 'user',
      });
  
      return await user.save();
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, dto, {
      new: true,
    }).select('-password');

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updatePassword(id: string, dto: UpdatePasswordDto): Promise<User> {
    const encryptedPassword = await this.encryptPassword(dto.password);

    const user = await this.userModel.findByIdAndUpdate(id, {password: encryptedPassword }, {
      new: true,
    }).select('-password');

    if (!user) throw new NotFoundException('User not found');
    return user;

  } 

  async remove(id: string) {
    const deletedUser= await  this.userModel.findOneAndDelete({ _id: id});

    if (!deletedUser) {
        throw new NotFoundException("User not found");
    }

    return { message: 'User deleted successfully' };
  }


  async encryptPassword(password: string) {

    return await bcrypt.hash(password, 10);
    
  }
}
