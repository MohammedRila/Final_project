export function AboutPhishHook() {
  return (
    <section id="about-phishhook" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Heading */}
          <h2 className="font-heading text-4xl font-extrabold text-primary-800 mb-8">
            About PhishHook AI
          </h2>

          {/* Description */}
          <p className="text-neutral-700 mb-8 text-lg leading-relaxed">
            PhishHook AI is a cutting-edge fake website detection tool that leverages advanced artificial intelligence to identify and flag potential phishing attempts. Our mission is to make the internet safer by providing users with instant feedback on the websites they visit.
          </p>

          <p className="text-neutral-700 mb-8 text-lg leading-relaxed">
            Using a combination of URL analysis, content verification, visual similarity detection, and behavioral patterns, our system can quickly determine whether a website is legitimate or potentially malicious.
          </p>

          <p className="text-neutral-700 text-lg leading-relaxed">
            Whether you're a security professional, business owner, or everyday internet user, PhishHook AI provides an extra layer of protection against evolving phishing tactics targeting your sensitive information.
          </p>
        </div>

        {/* Call-to-Action */}
        <div className="mt-12 text-center">
          <a
            href="#features"
            className="inline-block bg-primary-800 text-white font-medium px-8 py-3 rounded-md shadow-md hover:bg-primary-900 transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}