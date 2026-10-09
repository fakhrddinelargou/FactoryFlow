const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema(
    {
        material: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Material',
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['IN', 'OUT'],
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            validate: {
                validator: (v) => v > 0,
                message: 'La quantité doit être supérieure à 0',
            }
        },
        reason: {
            type: String,
            required: true,
            trim: true,
        },
        productionOrder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductionOrder',
            default: null,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
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

module.exports = mongoose.model('StockMovement', stockMovementSchema);