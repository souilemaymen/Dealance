import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName : { type: String },
    email: { type: String, unique: true },
    phoneNumber: { type: String, unique: true },
    password: { type: String },

    // Stepper fields
    userType: { type: String, enum: ['freelancer', 'client'], required: false },

    // freelancer fields
    category: String,
    customCategory: String,
    professionalTitle: String, // renommé depuis "title"
    bio: String,
    technologies: String,
    experience: String,
    portfolio: String,
    github: String,
    linkedin: String,
    otherLink: String,
    profileImage: { type: String },

    // client fields
    companyName: String,
    projectDescription: String,
    projectBudget: String,
    
  },
  { timestamps: true }
);

const User = mongoose.models?.User || mongoose.model("User", UserSchema);

export default User;
