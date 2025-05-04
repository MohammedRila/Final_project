export function Features() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl font-bold text-center text-primary-800 mb-4">How PhishHook AI Protects You</h2>
        <p className="text-center text-neutral-700 max-w-2xl mx-auto mb-12">Our advanced AI system analyzes multiple factors to determine if a website is legitimate or a potential phishing attempt.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-md p-6 transition-transform duration-300 hover:-translate-y-2">
            <div className="text-primary-700 text-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="font-heading font-semibold text-2xl mb-4 text-center text-primary-800">URL Analysis</h3>
            <p className="text-neutral-700 text-center">Examines URL structure, domain age, SSL certificates, and redirects to identify suspicious patterns.</p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-md p-6 transition-transform duration-300 hover:-translate-y-2">
            <div className="text-primary-700 text-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-heading font-semibold text-2xl mb-4 text-center text-primary-800">Content Verification</h3>
            <p className="text-neutral-700 text-center">Analyzes website content, looking for suspicious forms, scripts, and visual elements that mimic legitimate sites.</p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-md p-6 transition-transform duration-300 hover:-translate-y-2">
            <div className="text-primary-700 text-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-heading font-semibold text-2xl mb-4 text-center text-primary-800">Real-time Protection</h3>
            <p className="text-neutral-700 text-center">Cross-references with database of known phishing sites and provides instant feedback on potential threats.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
