import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Image, ImageDocument } from '../schemas/image.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateImageDto, UpdateImageDto, ImageQueryDto } from './dto/image.dto';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel(Image.name) private imageModel: Model<ImageDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createImageDto: CreateImageDto,
    file: Express.Multer.File,
    userId: string,
  ): Promise<ImageDocument> {
    try {
      // Upload to Cloudinary
      const uploadResult = await this.cloudinaryService.uploadImage(file);

      const imageData = {
        ...createImageDto,
        imageUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        uploadedBy: new Types.ObjectId(userId),
        fileSize: file.size,
        format: uploadResult.format,
        dimensions: {
          width: uploadResult.width,
          height: uploadResult.height,
        },
      };

      const image = new this.imageModel(imageData);
      return image.save();
    } catch (error) {
      throw new BadRequestException('Failed to upload image');
    }
  }

  async findAll(query: ImageQueryDto, userId?: string) {
    const {
      page = 1,
      limit = 12,
      category,
      tags,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      userId: filterUserId,
    } = query;

    const skip = (page - 1) * limit;
    const filter: any = { isPublic: true };

    if (category) {
      filter.category = category;
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      filter.tags = { $in: tagArray };
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (filterUserId) {
      filter.uploadedBy = new Types.ObjectId(filterUserId);
    }

    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const images = await this.imageModel
      .find(filter)
      .populate('uploadedBy', 'username firstName lastName avatar')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.imageModel.countDocuments(filter);

    return {
      images,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId?: string): Promise<ImageDocument> {
    const image = await this.imageModel
      .findById(id)
      .populate('uploadedBy', 'username firstName lastName avatar')
      .populate('likes.user', 'username')
      .exec();

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    if (!image.isPublic && (!userId || image.uploadedBy._id.toString() !== userId)) {
      throw new ForbiddenException('Access denied to private image');
    }

    // Increment view count
    image.views += 1;
    await image.save();

    return image;
  }

  async update(
    id: string,
    updateImageDto: UpdateImageDto,
    userId: string,
  ): Promise<ImageDocument> {
    const image = await this.imageModel.findById(id);

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    if (image.uploadedBy.toString() !== userId) {
      throw new ForbiddenException('You can only update your own images');
    }

    Object.assign(image, updateImageDto);
    return image.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const image = await this.imageModel.findById(id);

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    if (image.uploadedBy.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own images');
    }

    // Delete from Cloudinary
    await this.cloudinaryService.deleteImage(image.publicId);

    // Delete from database
    await this.imageModel.findByIdAndDelete(id);
  }

  async likeImage(id: string, userId: string): Promise<{ liked: boolean; likesCount: number }> {
    const image = await this.imageModel.findById(id);

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    const userObjectId = new Types.ObjectId(userId);
    const existingLike = image.likes.find(like => like.user.toString() === userId);

    if (existingLike) {
      // Unlike
      image.likes = image.likes.filter(like => like.user.toString() !== userId);
      await image.save();
      return { liked: false, likesCount: image.likes.length };
    } else {
      // Like
      image.likes.push({ user: userObjectId, likedAt: new Date() });
      await image.save();
      return { liked: true, likesCount: image.likes.length };
    }
  }

  async downloadImage(id: string): Promise<{ downloadUrl: string }> {
    const image = await this.imageModel.findById(id);

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    if (!image.isPublic) {
      throw new ForbiddenException('Cannot download private image');
    }

    // Increment download count
    image.downloads += 1;
    await image.save();

    return { downloadUrl: image.imageUrl };
  }

  async getUserImages(userId: string, page: number = 1, limit: number = 12) {
    const skip = (page - 1) * limit;

    const images = await this.imageModel
      .find({ uploadedBy: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.imageModel.countDocuments({ uploadedBy: new Types.ObjectId(userId) });

    return {
      images,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getImageStats() {
    const totalImages = await this.imageModel.countDocuments({ isPublic: true });
    const totalDownloads = await this.imageModel.aggregate([
      { $match: { isPublic: true } },
      { $group: { _id: null, total: { $sum: '$downloads' } } }
    ]);
    const totalViews = await this.imageModel.aggregate([
      { $match: { isPublic: true } },
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);

    return {
      totalImages,
      totalDownloads: totalDownloads[0]?.total || 0,
      totalViews: totalViews[0]?.total || 0,
    };
  }

  async getCategories() {
    const categories = await this.imageModel.distinct('category');
    return categories;
  }

  async getTrendingTags(limit: number = 10) {
    const tags = await this.imageModel.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);

    return tags.map(tag => ({ name: tag._id, count: tag.count }));
  }
}
