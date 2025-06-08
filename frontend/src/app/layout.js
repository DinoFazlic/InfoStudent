import './globals.css';

import './globals.css'
import Navbar from '../components/Navbar'
export const dynamic = 'force-dynamic';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
