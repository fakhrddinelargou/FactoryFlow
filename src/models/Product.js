const mongoose = require('mongoose');

const compositionItemSchema = new mongoose.Schema(
  {
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Material',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      validate: {
        validator: (v) => v > 0,
        message: 'La quantité doit être supérieure à 0',
      },
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    composition: {
      type: [compositionItemSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'La composition doit contenir au moins une matière',
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('Product', productSchema);