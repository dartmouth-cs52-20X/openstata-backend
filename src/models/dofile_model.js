import mongoose, { Schema } from 'mongoose';

// create a PostSchema with a title field
const DoFileSchema = new Schema({
  fileName: String,
  content: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  tutorialID: { type: String, default: null },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

// create PostModel class from schema
const DoFileModel = mongoose.model('DoFile', DoFileSchema);

export default DoFileModel;
