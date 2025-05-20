'use client'

import './globals.css'
export const dynamic = 'force-dynamic'; 
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}