import { model, Schema, Document, Model, Types } from "mongoose";

interface UserData {
  name: string;
  countryCode:string;
  phone: number;
  email?: string;
  profilePic?:string;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
}

interface UserDocument extends UserData, Document {
  // Add any additional methods or virtual properties specific to this model
}

const userSchema: Schema<UserDocument> = new Schema<UserDocument>(
  {
    name: {
      type: String,
      trim: true,
      default: "",
    },
    countryCode: {
      type: String,
      trim: true,
      default: "",
    },
    profilePic: {
      type: String,
      default: "",
    },
    phone: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      default: "",
      unique: true,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User: Model<UserDocument> = model<UserDocument>("User", userSchema);

export default User;
