export function Features() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl font-bold text-center text-primary-800 mb-4">How PhishHook AI Protects You</h2>
        <p className="text-center text-neutral-700 max-w-2xl mx-auto mb-12">Our advanced AI system analyzes multiple factors to determine if a website is legitimate or a potential phishing attempt.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-md p-6 transition-transform duration-300 hover:-translate-y-2">
            <div className="flex justify-center mb-4">
              <img 
                src="/static/assets/img/url-analysis.svg" 
                alt="URL Analysis" 
                className="h-20 w-20"
              />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-3 text-center">URL Analysis</h3>
            <p className="text-neutral-700">Examines URL structure, domain age, SSL certificates, and redirects to identify suspicious patterns.</p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-md p-6 transition-transform duration-300 hover:-translate-y-2">
            <div className="flex justify-center mb-4">
              <img 
                src="/static/assets/img/content-verification.svg" 
                alt="Content Verification" 
                className="h-20 w-20"
              />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-3 text-center">Content Verification</h3>
            <p className="text-neutral-700">Analyzes website content, looking for suspicious forms, scripts, and visual elements that mimic legitimate sites.</p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-md p-6 transition-transform duration-300 hover:-translate-y-2">
            <div className="flex justify-center mb-4">
              <img 
                src="/static/assets/img/real-time-protection.svg" 
                alt="Real-time Protection" 
                className="h-20 w-20"
              />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-3 text-center">Real-time Protection</h3>
            <p className="text-neutral-700">Cross-references with database of known phishing sites and provides instant feedback on potential threats.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
