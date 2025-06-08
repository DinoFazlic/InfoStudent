import './globals.css';

import './globals.css'
import Navbar from '../components/Navbar'
export const dynamic = 'force-dynamic';
import { Toaster } from 'react-hot-toast';
import { NotificationProvider } from '@/context/NotificationContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NotificationProvider>
          {children}
        </NotificationProvider>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
