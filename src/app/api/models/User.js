import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName : { type: String, required: true},
    email: { type: String, unique: true , required: true},
    phoneNumber: { type: String, unique: true , required: true},
    password: { type: String , required: true},

    // Stepper fields
    userType: { type: String, enum: ['freelancer', 'client'], required: false },

    // freelancer fields
    category: String,
    customCategory: String,
    professionalTitle: String, 
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
