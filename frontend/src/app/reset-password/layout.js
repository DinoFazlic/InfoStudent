import LandingNavbar from "@/components/Landing/LandingNavbar";
import Footer from "@/components/Footer";

export default function ResetPasswordLayout({ children }) {
  return (
    <div>
      <LandingNavbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}