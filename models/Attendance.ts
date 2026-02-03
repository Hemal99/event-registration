
import mongoose, { Document, Model } from 'mongoose';

// FIX: Add an interface for the Attendee document for better type safety.
export interface IAttendee extends Document {
  "Name": string;
  "Year": number;
  "Amount paid": number;
  "Balance need to pay": number;
  "Description"?: string;
  "Gender"?: string;
  "Count"?: number;
  "Email": string;
}

const attendeeSchema = new mongoose.Schema({
  "Name": { type: String, required: true },
  "Year": { type: Number, required: true },
  "Amount paid": { type: Number, required: true },
  "Balance need to pay": { type: Number, required: true },
  "Description": { type: String },
  "Gender": { type: String },
  "Count": { type: Number },
  "Email": { type: String, required: true, unique: true }
}, {
  // FIX: Explicitly set the collection name to 'attendance' to override Mongoose's default pluralization.
  collection: 'attendance'
});

// The collection will be named 'attendance' in the 'stat-data' database
// FIX: Explicitly type the model to prevent TypeScript errors in serverless environments.
const AttendanceModel: Model<IAttendee> = mongoose.models.Attendance || mongoose.model<IAttendee>('Attendance', attendeeSchema);

export default AttendanceModel;