import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  author: string;
  date: Date;
  category: string;
  info: string;
  description: string;
  image: {
    data: Buffer;
    contentType: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, "Title is odiously required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "psychology",
        "wellness-guide",
        "relationships",
        "therapy",
        "trending",
      ],
    },
    info: {
      type: String,
      required: [true, "Info is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    image: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Blog ||
  mongoose.model<IBlog>("Blog", BlogSchema);
