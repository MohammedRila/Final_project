import { URLScanForm } from "./URLScanForm";

export function Hero() {
  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-3xl text-center" data-aos="fade-up">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-800 mb-6">
              Fake Website Detection
            </h1>
            <p className="text-neutral-700 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Protect yourself from phishing attacks with our advanced AI detection system. Enter any URL to check if it's safe.
            </p>
            
            <div className="max-w-xl mx-auto">
              <URLScanForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
