import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { AboutPhishHook } from "@/components/home/AboutPhishHook";
import { Features } from "@/components/home/Features";
import { CallToAction } from "@/components/home/CallToAction";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <AboutPhishHook />
        <Features />
        <About />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
