


import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
export const dynamic = 'force-dynamic'; 
import { NotificationProvider } from '@/context/NotificationContext';
export default function RootLayout({ children }) {
  return (
      <>
      
        <Navbar/>
        <NotificationProvider>
          {children}
        </NotificationProvider>
        <Footer/>
      </>
  );
}
