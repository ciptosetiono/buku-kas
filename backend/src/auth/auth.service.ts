import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';

import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from '../users/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  // Register user
  async register(createUserDto: CreateUserDto): Promise<{ user: User, token: string }> {
    const { email, password, name } = createUserDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      name,
      email,
      password: hashedPassword,
      role: 'user',
    });

    await user.save();

    const token = this.generateToken(user);

    return { user, token };
  }

  // Login user
  async login(loginDto: LoginDto): Promise<{ user: User, token: string }> {
    const { email, password } = loginDto;

    if (!email || !password) {
        throw new UnauthorizedException('Credential is required'); // Pastikan password diisi
    }

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  // Get current user profile
  async getProfile(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async validateUser(email: string, password: string | null): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return null; // Pengguna tidak ditemukan
    }
  
    // Jika password diberikan (misalnya saat login), kita akan memverifikasi password
    if (password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return null; // Password tidak valid
      }
    }
  
    return user; // Pengguna ditemukan dan password valid (atau tidak perlu validasi password)
  }
  
  // JWT Token generator
  private generateToken(user: UserDocument): string {
    return this.jwtService.sign({
      sub: user._id,
      email: user.email,
      role: user.role,
    });
  }
}
