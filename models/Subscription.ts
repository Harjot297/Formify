import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  subscribed: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // ✅ Adds createdAt and updatedAt automatically
});

export const Subscription = mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);
