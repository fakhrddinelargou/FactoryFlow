const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
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
        unit: {
            type: String,
            required: true,
            trim: true,
        },
        availableQuantity: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        alertThreshold: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
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



module.exports = mongoose.model('Material', materialSchema);