import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: { type: String },
  username: { type: String },
}, {
  toObject: { virtuals: true },
  toJSON: {
    virtuals: true,
    transform(doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
      return ret;
    },
  },
  timestamps: true,
});

UserSchema.pre('save', function beforeyYourModelSave(next) {
  // this is a reference to our model
  // the function runs in some other context so DO NOT bind it
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(user.password, salt);

  user.password = hash;

  // when done run the **next** callback with no arguments
  // call next with an error if you encounter one
  return next();
});

UserSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  // return callback(null, comparisonResult) for success
  // or callback(error) in the error case
  bcrypt.compare(candidatePassword, this.password, (error, result) => {
    if (error) return callback(error);
    else return callback(null, result);
  });
};

// create UserModel class from schema
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
