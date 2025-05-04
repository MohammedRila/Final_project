import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";

export function Header() {
  const isMobile = useMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHelpDropdownOpen, setIsHelpDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  };

  const toggleHelpDropdown = () => {
    setIsHelpDropdownOpen(!isHelpDropdownOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.classList.remove("overflow-hidden");
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="fixed w-full bg-white shadow-md z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            {/* Logo section */}
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-primary-700 flex items-center justify-center">
                <i className="fas fa-shield-alt text-white text-xl"></i>
              </div>
              <Link href="/" className="font-heading font-bold text-xl text-primary-800">PhishHook AI</Link>
            </div>
            
            {/* Mobile menu button */}
            {isMobile && (
              <button 
                onClick={toggleMobileMenu} 
                className="lg:hidden text-neutral-700 focus:outline-none"
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
            )}
            
            {/* Desktop navigation */}
            {!isMobile && (
              <nav className="flex items-center space-x-8">
                <Link href="/" className="text-primary-800 font-medium hover:text-primary-600 transition-colors px-1 py-2 border-b-2 border-primary-600">Home</Link>
                <a href="#about" className="text-neutral-700 font-medium hover:text-primary-600 transition-colors px-1 py-2">About</a>
                <Link href="/usecases" className="text-neutral-700 font-medium hover:text-primary-600 transition-colors px-1 py-2">Use Cases</Link>
                
                {/* Dropdown */}
                <div className="relative group">
                  <button className="text-neutral-700 font-medium hover:text-primary-600 transition-colors flex items-center gap-1 px-1 py-2">
                    Help
                    <i className="fas fa-chevron-down text-xs transform group-hover:rotate-180 transition-transform duration-200"></i>
                  </button>
                  <div className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-neutral-800">Report Phishing Cases</span>
                        <a href="https://safebrowsing.google.com/safebrowsing/report_phish/?hl=en" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-gray-100 hover:text-primary-600">
                          Google Safe Browsing
                        </a>
                        <a href="https://support.google.com/websearch/answer/106318" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-gray-100 hover:text-primary-600">
                          Google Support
                        </a>
                      </div>
                      <div className="px-4 py-2">
                        <span className="text-sm font-medium text-neutral-800">Take Phishing Quiz</span>
                        <a href="https://www.phishingbox.com/phishing-iq-test" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-gray-100 hover:text-primary-600">
                          Phishingbox
                        </a>
                        <a href="https://www.intradyn.com/phishing-quiz/" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-gray-100 hover:text-primary-600">
                          Intradyn
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
            )}
            
            {/* Download guide button */}
            {!isMobile && (
              <a 
                href="/static/assets/Phishing Website Identification.pdf" 
                download="phishing-protection-guide" 
                className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 rounded-md transition-colors shadow-md"
              >
                <span>Download Guide</span>
                <i className="fas fa-download"></i>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="bg-white h-full w-4/5 max-w-xs p-4 transform transition-transform duration-200 translate-x-0">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center">
                  <i className="fas fa-shield-alt text-white text-sm"></i>
                </div>
                <span className="font-heading font-bold text-lg text-primary-800">PhishHook AI</span>
              </div>
              <button 
                onClick={closeMobileMenu} 
                className="text-neutral-700 focus:outline-none"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-primary-800 font-medium hover:text-primary-600 transition-colors py-2 border-b border-gray-100" onClick={closeMobileMenu}>Home</Link>
              <a href="#about" className="text-neutral-700 font-medium hover:text-primary-600 transition-colors py-2 border-b border-gray-100" onClick={closeMobileMenu}>About</a>
              <Link href="/usecases" className="text-neutral-700 font-medium hover:text-primary-600 transition-colors py-2 border-b border-gray-100" onClick={closeMobileMenu}>Use Cases</Link>
              
              {/* Mobile dropdown */}
              <div className="py-2 border-b border-gray-100">
                <button 
                  onClick={toggleHelpDropdown}
                  className="text-neutral-700 font-medium hover:text-primary-600 transition-colors flex items-center justify-between w-full"
                >
                  Help
                  <i className={`fas fa-chevron-down text-xs transform transition-transform duration-200 ${isHelpDropdownOpen ? 'rotate-180' : ''}`}></i>
                </button>
                {isHelpDropdownOpen && (
                  <div className="mt-2 pl-4">
                    <div className="mb-2">
                      <span className="text-sm font-medium text-neutral-800">Report Phishing Cases</span>
                      <a href="https://safebrowsing.google.com/safebrowsing/report_phish/?hl=en" target="_blank" rel="noopener noreferrer" className="block px-2 py-1 text-sm text-neutral-700 hover:text-primary-600">
                        Google Safe Browsing
                      </a>
                      <a href="https://support.google.com/websearch/answer/106318" target="_blank" rel="noopener noreferrer" className="block px-2 py-1 text-sm text-neutral-700 hover:text-primary-600">
                        Google Support
                      </a>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-neutral-800">Take Phishing Quiz</span>
                      <a href="https://www.phishingbox.com/phishing-iq-test" target="_blank" rel="noopener noreferrer" className="block px-2 py-1 text-sm text-neutral-700 hover:text-primary-600">
                        Phishingbox
                      </a>
                      <a href="https://www.intradyn.com/phishing-quiz/" target="_blank" rel="noopener noreferrer" className="block px-2 py-1 text-sm text-neutral-700 hover:text-primary-600">
                        Intradyn
                      </a>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Mobile download guide button */}
              <a 
                href="/static/assets/Phishing Website Identification.pdf" 
                download="phishing-protection-guide" 
                className="flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 rounded-md transition-colors shadow-md mt-4"
              >
                <span>Download Guide</span>
                <i className="fas fa-download"></i>
              </a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
