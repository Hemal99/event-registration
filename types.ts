
export interface Attendee {
  _id: string;
  "Name": string;
  "Year": number;
  "Amount paid": number;
  "Balance need to pay": number;
  "Description": string;
  "Gender": string;
  "Count": number;
  "Email": string;
}

// FIX: Define VerificationData and VerificationStatus in a shared location to ensure type consistency.
export interface VerificationData {
  "Name": string;
  "Year": number;
  "Amount paid": number;
  "Balance need to pay": number;
}

export interface VerificationStatus {
  data: VerificationData | null;
  error?: string;
}
