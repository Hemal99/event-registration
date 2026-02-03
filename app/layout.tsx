
import React from 'react';
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Event Registration & QR Verification</title>
        <meta name="description" content="A web dashboard to upload attendee lists, view data, and send email tickets with QR codes." />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <Script src="https://cdn.tailwindcss.com" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js" strategy="beforeInteractive" />
        <Script src="https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js" strategy="beforeInteractive" />
      </head>
      <body className="bg-gray-100 dark:bg-gray-900">
        {children}
      </body>
    </html>
  );
}
