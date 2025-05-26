
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
export const dynamic = 'force-dynamic'; 
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Navbar></Navbar>
        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}
