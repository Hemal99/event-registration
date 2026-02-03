
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Attendance from '../../../models/Attendance';

export async function POST(request: Request) {
  console.log('[/api/attendees/upload] - POST request received.');
  try {
    await dbConnect();
    console.log('[/api/attendees/upload] - Database connection successful.');

    const { attendees } = await request.json();

    if (!attendees || !Array.isArray(attendees)) {
      console.log('[/api/attendees/upload] - Invalid data format.');
      return NextResponse.json({ message: 'Invalid data format. "attendees" array is required.' }, { status: 400 });
    }
    
    console.log(`[/api/attendees/upload] - Attempting to insert ${attendees.length} documents.`);
    // Use insertMany for efficient bulk insertion.
    const insertedAttendees = await Attendance.insertMany(attendees, { ordered: false });
    
    console.log(`[/api/attendees/upload] - Successfully inserted ${insertedAttendees.length} documents.`);
    return NextResponse.json({ 
        message: `${insertedAttendees.length} attendees saved successfully.`,
        data: insertedAttendees 
    }, { status: 201 });

  } catch (error: any) {
    console.error('API Upload Error:', error);
    if (error.code === 11000) { // Handle duplicate email errors
        return NextResponse.json({ 
            message: 'Some attendees could not be saved due to duplicate emails.',
            details: error.writeErrors ? error.writeErrors.map((e: any) => e.err.errmsg) : 'Duplicate key error'
        }, { status: 409 });
    }

    // Add check for Mongoose validation error
    if (error.name === 'ValidationError') {
        return NextResponse.json({
            message: 'Data validation failed. Please check your Excel file for correct data types (e.g., numbers in numeric columns).',
            details: error.errors
        }, { status: 400 });
    }

    // A more generic catch-all for bulk write errors that includes validation failures
    if (error.name === 'MongoBulkWriteError' && error.writeErrors?.length > 0) {
        return NextResponse.json({
            message: 'Some records failed validation and were not inserted. Please check data types in your file.',
            details: error.writeErrors.map((e: any) => e.errmsg)
        }, { status: 400 });
    }
    
    return NextResponse.json({ message: 'An error occurred on the server.', error: error.message }, { status: 500 });
  }
}