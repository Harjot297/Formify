import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";


const formSchema = new mongoose.Schema({
  ownerId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  published: {
    type: Boolean,
    default: false,
  },
  content: {
    type: mongoose.Schema.Types.Mixed, // for JSON
  },
  submissions: {
    type: Number,
    default: 0,
  },
  shareUrl: {
    type: String,
    default: uuidv4,
  },
  formSubmissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submissions", // fixed typo
    },
  ],
});

export const Form = mongoose.models.Form ||  mongoose.model("Form", formSchema);

