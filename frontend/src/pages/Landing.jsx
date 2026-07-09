import { useState } from "react";

import LandingNavbar from "../components/layout/LandingNavbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import TechStack from "../components/landing/TechStack";
import FAQ from "../components/landing/FAQ";
import Footer from "../components/layout/Footer";
import GoogleLoginModal from "../components/auth/GoogleLoginModal";

export default function Landing() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <LandingNavbar onStartExploring={() => setShowLogin(true)} />

      <main>
        <Hero onStartExploring={() => setShowLogin(true)} />

        <Features />
        <HowItWorks />
        <TechStack />
        <FAQ />
      </main>

      <Footer />

      <GoogleLoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
}
