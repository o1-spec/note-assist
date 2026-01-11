import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  originalNotes: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
  },
  questions: [{
    type: String,
  }],
  category: {
    type: String,
    default: 'General',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);