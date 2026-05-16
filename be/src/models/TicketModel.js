import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    region: {
      type: String,
      default: null,
    },
    workerName: {
      type: String,
      required: true,
    },
    workerId: {
      type: String,
      required: true,
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ngoResponse: {
      type: String,
      default: null,
    },
    responseDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Generate ticket ID before saving
ticketSchema.pre('save', async function(next) {
  if (!this.ticketId) {
    const count = await mongoose.model('Ticket').countDocuments();
    this.ticketId = `TKT-${202400 + count + 1}`;
  }
  next();
});

// Indexes
ticketSchema.index({ workerId: 1 });
ticketSchema.index({ status: 1 });
ticketSchema.index({ priority: 1 });

export const Ticket = mongoose.model('Ticket', ticketSchema);
