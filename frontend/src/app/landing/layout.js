import "../globals.css";
import LandingNavbar from "@/components/Landing/LandingNavbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "InfoStudent",
  description: "Student job and internship platform",
};

export default function LandingLayout({ children }) {
  return (
    <>
      <LandingNavbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}