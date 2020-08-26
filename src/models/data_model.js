import mongoose, { Schema } from 'mongoose';

const DataSchema = new Schema({
  fileName: { type: String, index: true, required: true },
  url: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

const DataModel = mongoose.model('DataFile', DataSchema);

export default DataModel;
