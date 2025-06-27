import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ImageDocument = Image & Document;

@Schema({ 
  timestamps: true,
  toJSON: { virtuals: true }
})
export class Image {
  @Prop({ 
    required: true, 
    trim: true,
    maxlength: 100 
  })
  title: string;

  @Prop({ 
    trim: true,
    maxlength: 500 
  })
  description: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  publicId: string;

  @Prop({ 
    required: true,
    enum: ['nature', 'technology', 'people', 'architecture', 'animals', 'food', 'travel', 'art', 'other']
  })
  category: string;

  @Prop([{
    type: String,
    trim: true,
    lowercase: true
  }])
  tags: string[];

  @Prop({ 
    type: Types.ObjectId, 
    ref: 'User', 
    required: true 
  })
  uploadedBy: Types.ObjectId;

  @Prop([{
    user: {
      type: Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }])
  likes: Array<{
    user: Types.ObjectId;
    likedAt: Date;
  }>;

  @Prop({ default: 0 })
  downloads: number;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: true })
  isPublic: boolean;

  @Prop({ required: true })
  fileSize: number;

  @Prop({
    type: {
      width: Number,
      height: Number
    }
  })
  dimensions: {
    width: number;
    height: number;
  };

  @Prop({ required: true })
  format: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);

// Add indexes
ImageSchema.index({ uploadedBy: 1 });
ImageSchema.index({ category: 1 });
ImageSchema.index({ tags: 1 });
ImageSchema.index({ createdAt: -1 });
ImageSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for likes count
ImageSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});
