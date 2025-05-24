import './globals.css';

import './globals.css'
import Navbar from '../components/Navbar'
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
