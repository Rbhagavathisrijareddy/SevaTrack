import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    submissionId: {
      type: String,
      unique: true,
      required: true,
    },
    workerId: {
      type: String,
      required: true,
    },
    workerName: {
      type: String,
      required: true,
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    reliefType: {
      type: String,
      required: true,
    },
    disasterType: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    beneficiaryCount: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending Review', 'Approved', 'Delivered', 'Verified', 'Rejected', 'Acknowledged'],
      default: 'Pending Review',
    },
    ticketStatus: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
    },
    ngoResponse: {
      type: String,
      default: null,
    },
    ngoResponseDate: {
      type: Date,
      default: null,
    },
    viewedByNGO: {
      type: Boolean,
      default: false,
    },
    viewedAt: {
      type: Date,
      default: null,
    },
    workerAcknowledgment: {
      type: String,
      default: null,
    },
    acknowledgmentDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Generate submission ID before saving
reportSchema.pre('save', async function(next) {
  if (!this.submissionId) {
    const count = await mongoose.model('Report').countDocuments();
    this.submissionId = `SUB-${2024000 + count + 1}`;
  }
  next();
});

// Index for faster queries
reportSchema.index({ workerId: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ region: 1 });
reportSchema.index({ createdAt: -1 });

export const Report = mongoose.model('Report', reportSchema);
