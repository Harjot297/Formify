import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now, // ✅ corrected
  },
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form", // ✅ correct reference
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.Mixed, // ✅ corrected
    required: true,
  },
});

export const Submissions = mongoose.models.Submissions ||  mongoose.model("Submissions", SubmissionSchema);

