import React, { Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";

// Lazy load components with explicit default export handling
const AboutPhishHook = React.lazy(() =>
  import("@/components/home/AboutPhishHook").then((module) => ({
    default: module.AboutPhishHook,
  }))
);

const Features = React.lazy(() =>
  import("@/components/home/Features").then((module) => ({
    default: module.Features,
  }))
);

const About = React.lazy(() =>
  import("@/components/home/About").then((module) => ({
    default: module.About,
  }))
);

const CallToAction = React.lazy(() =>
  import("@/components/home/CallToAction").then((module) => ({
    default: module.CallToAction,
  }))
);

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 300);
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    isVisible && (
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-4 right-4 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-all"
        aria-label="Back to top"
      >
        ↑
      </button>
    )
  );
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* SEO Metadata */}
      <Helmet>
        <title>PhishHook AI - Protect Yourself from Phishing Attacks</title>
        <meta
          name="description"
          content="PhishHook AI provides state-of-the-art phishing detection tools to protect individuals and organizations from online threats."
        />
        <meta property="og:title" content="PhishHook AI" />
        <meta property="og:description" content="Protect yourself from online phishing attacks with PhishHook AI." />
        <meta property="og:image" content="/static/assets/social-preview.png" />
        <meta property="og:url" content="https://yourdomain.com" />
        <link rel="canonical" href="https://yourdomain.com" />
      </Helmet>

      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Lazy-loaded sections */}
        <Suspense fallback={<div>Loading AboutPhishHook...</div>}>
          <AboutPhishHook />
        </Suspense>
        <Suspense fallback={<div>Loading Features...</div>}>
          <Features />
        </Suspense>
        <Suspense fallback={<div>Loading About...</div>}>
          <About />
        </Suspense>
        <Suspense fallback={<div>Loading CallToAction...</div>}>
          <CallToAction />
        </Suspense>
      </main>

      <Footer />

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}