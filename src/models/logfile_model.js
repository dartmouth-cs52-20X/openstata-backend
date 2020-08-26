import mongoose, { Schema } from 'mongoose';

// create a PostSchema with a title field
const LogFileSchema = new Schema({
  fileName: String,
  content: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

// create PostModel class from schema
const LogFileModel = mongoose.model('DoFile', LogFileSchema);

export default LogFileModel;
