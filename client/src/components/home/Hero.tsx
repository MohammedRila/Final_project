import { URLScanForm } from "./URLScanForm";

export function Hero() {
  return (
    <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 bg-gradient-to-b from-primary-50 to-white overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-300 rounded-full blur-3xl opacity-50 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center">
          <div
            className="w-full max-w-3xl text-center"
            data-aos="fade-up"
            style={{ minHeight: "480px" }} // Reserve space for the result section
          >
            {/* Headline */}
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-800 mb-6 leading-tight tracking-tighter">
              Fake Website Detection <span className="text-primary-600">Simplified</span>
            </h1>

            {/* Description */}
            <p className="text-neutral-700 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Protect yourself from phishing attacks with our advanced AI detection system. Enter any URL to check if it's safe and stay secure online.
            </p>

            {/* URL Scan Form */}
            <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6">
              <URLScanForm />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-32"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            fill="#f3f4f6"
            fillOpacity="1"
            d="M0,256L48,224C96,192,192,128,288,112C384,96,480,128,576,165.3C672,203,768,245,864,250.7C960,256,1056,224,1152,186.7C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}