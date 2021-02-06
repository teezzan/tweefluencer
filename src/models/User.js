var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const UserSchema = Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  password: { type: String, required: true },
  twitter_id: { type: String, default: null },
}, { id: true });

// Duplicate the ID field.
UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id }
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel
