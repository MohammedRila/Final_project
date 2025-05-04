import { URLScanForm } from "./URLScanForm";

export function Hero() {
  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="w-full md:w-1/2 text-center md:text-left" data-aos="fade-right">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-800 mb-4">
              Fake Website Detection
            </h1>
            <p className="text-neutral-700 text-lg mb-8 max-w-lg mx-auto md:mx-0">
              Protect yourself from phishing attacks with our advanced AI detection system. Enter any URL to check if it's safe.
            </p>
            
            <URLScanForm />
          </div>
          
          <div className="w-full md:w-1/2" data-aos="fade-left">
            <img 
              src="/static/assets/img/Phishing.gif" 
              alt="Phishing protection illustration" 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
