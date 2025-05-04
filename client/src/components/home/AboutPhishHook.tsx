export function AboutPhishHook() {
  return (
    <section id="about-phishhook" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <h2 className="font-heading text-3xl font-bold text-primary-800 mb-4">
              About PhishHook AI
            </h2>
            <p className="text-neutral-700 mb-4">
              PhishHook AI is a cutting-edge fake website detection tool that leverages advanced artificial intelligence to identify and flag potential phishing attempts. Our mission is to make the internet safer by providing users with instant feedback on websites they visit.
            </p>
            <p className="text-neutral-700 mb-4">
              Using a combination of URL analysis, content verification, visual similarity detection, and behavioral patterns, our system can quickly determine whether a website is legitimate or potentially malicious.
            </p>
            <p className="text-neutral-700">
              Whether you're a security professional, business owner, or everyday internet user, PhishHook AI provides an extra layer of protection against evolving phishing tactics targeting your sensitive information.
            </p>
          </div>
          
          <div className="w-full md:w-1/2 order-1 md:order-2">
            <img 
              src="/static/assets/img/about-security.svg" 
              alt="Web security illustration" 
              className="w-full h-auto rounded-lg shadow-lg animate-fadeIn"
            />
          </div>
        </div>
      </div>
    </section>
  );
}