export function Footer() {
  return (
    <footer className="bg-neutral-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                <i className="fas fa-shield-alt text-primary-800 text-xl"></i>
              </div>
              <span className="font-heading font-bold text-xl">PhishHook AI</span>
            </div>
            <p className="text-gray-300 mb-4">Protecting users from online phishing threats with advanced AI detection technology.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-white transition-colors">About Phishing</a></li>
              <li><a href="/usecases" className="text-gray-300 hover:text-white transition-colors">Use Cases</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">API Documentation</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="font-medium text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="/static/assets/Phishing Website Identification.pdf" download="phishing-protection-guide" className="text-gray-300 hover:text-white transition-colors">Phishing Guide</a></li>
              <li><a href="https://safebrowsing.google.com/safebrowsing/report_phish/?hl=en" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">Report Phishing</a></li>
              <li><a href="https://www.phishingbox.com/phishing-iq-test" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">Phishing Quiz</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <hr className="border-gray-700 my-8" />
        
        <div className="text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} PhishHook AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
