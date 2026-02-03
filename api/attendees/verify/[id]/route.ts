
import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
// FIX: Import the IAttendee interface for type safety.
import Attendance, { IAttendee } from '../../../../models/Attendance';
import mongoose from 'mongoose';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid attendee ID format.' }, { status: 400 });
    }
    
    // FIX: Add type annotation for the retrieved document. This resolves the call expression error.
    const attendee: IAttendee | null = await Attendance.findById(id);
    
    if (!attendee) {
      return NextResponse.json({ message: 'Attendee not found.' }, { status: 404 });
    }
    
    // Return only the specific fields required by the scanner app
    return NextResponse.json({
        "Name": attendee.Name,
        "Amount paid": attendee["Amount paid"],
        "Year": attendee.Year,
        "Balance need to pay": attendee["Balance need to pay"]
    });
      
  } catch (error: any) {
    console.error(`API Verify Error for ID ${id}:`, error);
    return NextResponse.json({ message: 'An error occurred on the server.', error: error.message }, { status: 500 });
  }
}
