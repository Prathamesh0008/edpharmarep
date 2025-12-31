// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//   email: String,
//   password: String,
//   role: {
//     type: String,
//     default: "user",
//   },
// });

// export default mongoose.models.User || mongoose.model("User", UserSchema);


import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },

    mobile: { type: String, default: "" },
    gender: { type: String, default: "" },
  },
  {
    timestamps: true,
    collection: "loginpage",
  }
);

// 🔑 TURBOPACK SAFE EXPORT
const User =
  mongoose.models.User || mongoose.model("User", UserSchema);

export default User;