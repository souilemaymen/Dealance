import mongoose from 'mongoose';

const PublicationSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  tags: [String],
  media: String,
  budget: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ['client', 'freelancer'],
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Vérifier si le modèle existe déjà avant de le créer
const Publication = mongoose.models.Publication || 
                   mongoose.model('Publication', PublicationSchema);

export default Publication;