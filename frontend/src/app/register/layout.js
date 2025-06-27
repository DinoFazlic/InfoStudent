import LandingNavbar from "@/components/Landing/LandingNavbar";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingNavbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}