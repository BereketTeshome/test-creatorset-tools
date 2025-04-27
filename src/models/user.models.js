import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "username is required"],
      unique: [true, "username already exists"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    firstName: {
      type: String,
      required: [true, "firstName is required"],
    },
    lastName: {
      type: String,
      required: [true, "lastName is required"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
    verifyToken: {
      type: String,
    },
    verifyTokenExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = models.users || model("users", userSchema);
export default User;
