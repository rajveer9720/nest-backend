import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(userData: Partial<User>): Promise<UserDocument> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByUsername(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username }).exec();
  }

  async findByEmailOrUsername(email: string, username: string): Promise<UserDocument> {
    return this.userModel.findOne({
      $or: [{ email }, { username }]
    }).exec();
  }

  async findByPasswordResetToken(token: string): Promise<UserDocument> {
    return this.userModel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    }).exec();
  }

  async findByEmailVerificationToken(token: string): Promise<UserDocument> {
    return this.userModel.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    }).exec();
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateProfileDto);
    return user.save();
  }

  async getUserProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password -refreshTokens -passwordResetToken -emailVerificationToken').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getAllUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const users = await this.userModel
      .find({ isActive: true })
      .select('-password -refreshTokens -passwordResetToken -emailVerificationToken')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const total = await this.userModel.countDocuments({ isActive: true });

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async deactivateUser(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { isActive: false });
  }

  async getUserStats(userId: string) {
    // This will be implemented with aggregation to get user's image stats
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // TODO: Add aggregation to get:
    // - Total uploaded images
    // - Total likes received
    // - Total downloads
    // - Join date
    
    return {
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        joinDate: (user as any).createdAt,
      },
      stats: {
        totalImages: 0, // Will be calculated
        totalLikes: 0, // Will be calculated
        totalDownloads: 0, // Will be calculated
      },
    };
  }
}
