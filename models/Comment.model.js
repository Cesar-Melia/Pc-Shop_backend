const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Types.ObjectId, ref: 'Products', required: true },
    user: { type: mongoose.Types.ObjectId, ref: 'Users', required: true },
    text: { type: String, required: true },
    date: { type: Number, required: true },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comments', commentSchema);

module.exports = Comment;
