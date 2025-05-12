const mongoose = require('mongoose');

const AIModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  pricing: {
    type: String,
    required: true,
    trim: true
  },
  features: {
    type: [String],
    required: true
  },
  popularity: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  releaseDate: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: '/placeholder-ai.png'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AIModel', AIModelSchema);
