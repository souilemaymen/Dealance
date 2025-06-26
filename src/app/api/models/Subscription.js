import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  phoneNumber : {
    type : String, 
    required : true
  },
  subscriptionType: {
    type: String,
    enum: ["Null", "Basique", "Pro", "Elite"], // Valeurs autorisées
    default: "Null", // Valeur par défaut
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Subscription = mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);

export default Subscription;