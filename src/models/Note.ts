import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  originalNotes: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    default: '',
  },
  questions: [{
    question: String,
    answer: String,
  }],
}, {
  timestamps: true,
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);