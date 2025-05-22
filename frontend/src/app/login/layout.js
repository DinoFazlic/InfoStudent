import LandingNavbar from "@/components/Landing/LandingNavbar";
import Footer from "@/components/Footer";

export default function LoginLayout({ children }) {
  return (
    <div className="flex flex-col">
      <LandingNavbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
