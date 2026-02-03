
import React from 'react';
import CodeBlock from '../components/CodeBlock';
import { ServerIcon, FileCodeIcon } from '../components/icons/ActionIcons';

const uploadRouteCode = `
// FILE: api/attendees/upload/route.ts
// DESC: Handles POST requests to upload and save attendee data.

import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Attendance from '../../../models/Attendance';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { attendees } = await request.json();

    if (!attendees || !Array.isArray(attendees)) {
      return NextResponse.json({ message: 'Invalid data format.' }, { status: 400 });
    }

    const insertedAttendees = await Attendance.insertMany(attendees, { ordered: false });
    
    return NextResponse.json({ 
        message: \`\${insertedAttendees.length} attendees saved.\`,
        data: insertedAttendees 
    }, { status: 201 });

  } catch (error: any) {
    if (error.code === 11000) {
        return NextResponse.json({ message: 'Duplicate emails found.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}
`;

const verifyRouteCode = `
// FILE: api/attendees/verify/[id]/route.ts
// DESC: Handles GET requests to verify an attendee by their ID.

import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Attendance from '../../../../models/Attendance';
import mongoose from 'mongoose';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID format.' }, { status: 400 });
    }
    
    const attendee = await Attendance.findById(id);
    
    if (!attendee) {
      return NextResponse.json({ message: 'Attendee not found.' }, { status: 404 });
    }
    
    return NextResponse.json({
        "Name": attendee.Name,
        "Amount paid": attendee["Amount paid"],
        "Year": attendee.Year,
        "Balance need to pay": attendee["Balance need to pay"]
    });
      
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}
`;

const ApiPage: React.FC = () => {
  return (
    <div className="space-y-8">
        <div className="p-6 md:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-4">
                <ServerIcon className="h-8 w-8 text-indigo-500 flex-shrink-0 mt-1" />
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Backend API with Next.js</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Instead of a separate Express server, we use Next.js API Routes. Files inside the <code className="bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-1 text-xs">/api</code> directory become automatic server-side endpoints.
                    </p>
                </div>
            </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center"><FileCodeIcon className="h-5 w-5 mr-2" />Upload Endpoint</h3>
            <CodeBlock language="typescript" code={uploadRouteCode} />
        </div>

         <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center"><FileCodeIcon className="h-5 w-5 mr-2" />Verification Endpoint</h3>
            <CodeBlock language="typescript" code={verifyRouteCode} />
        </div>
    </div>
  );
};

export default ApiPage;
