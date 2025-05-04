export function CallToAction() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-12 bg-gradient-to-br from-primary-800 to-primary-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">Start Protecting Yourself Today</h2>
            <p className="text-primary-100 mb-8 max-w-xl mx-auto lg:mx-0">Use our free tool to check any suspicious URL before you visit it and download our comprehensive guide to staying safe online.</p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <button 
                onClick={scrollToTop}
                className="bg-white hover:bg-gray-100 text-primary-800 font-medium px-6 py-3 rounded-md transition-colors shadow-md flex items-center justify-center"
              >
                <span>Scan a URL Now</span>
                <i className="fas fa-arrow-right ml-2"></i>
              </button>
              <a 
                href="/static/assets/Phishing Website Identification.pdf" 
                download="phishing-protection-guide" 
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-md transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>Download Guide</span>
                <i className="fas fa-download"></i>
              </a>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0 flex justify-center">
            <img 
              src="/static/assets/img/cta-shield.svg" 
              alt="Security protection illustration" 
              className="w-full max-w-md h-auto animate-fadeIn"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
