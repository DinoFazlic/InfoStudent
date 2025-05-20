import Image from "next/image";
import Link from "next/link";
import Navbar from "./Navbar";

export default function LoggedOutLanding() {
  return (
    <div className="min-h-screen bg-[url('/post-bg-invert.svg')] bg-repeat text-slate-800">
      <Navbar />
      <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Dobrodošli na InfoStudent</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6">
          Pronađi poslove, prakse i instrukcije koje ti trebaju – bez prijave!
        </p>
        <Link
          href="/register"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Registruj se odmah
        </Link>

        <div className="mt-16 grid gap-6 grid-cols-1 md:grid-cols-3">
          <Card title="Instrukcije" desc="Privatni časovi od studenata i asistenata." />
          <Card title="Prakse" desc="Pronađi praktično iskustvo u svojoj oblasti." />
          <Card title="Poslovi" desc="Fleksibilni studentski poslovi širom BiH." />
        </div>
      </div>
    </div>
  );
}

function Card({ title, desc }) {
  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-sm p-6 shadow hover:shadow-md transition">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-slate-700">{desc}</p>
    </div>
  );
}
