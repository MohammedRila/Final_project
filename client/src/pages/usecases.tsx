import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Usecases() {
  const useCaseItems = [
    {
      title: "Personal Online Safety",
      description: "Individuals can use PhishHook AI to verify the safety of links received in emails, messages, or social media before clicking on them.",
      icon: "user-shield",
    },
    {
      title: "Financial Transaction Protection",
      description: "Before entering banking details or making payments online, users can check if the website is legitimate to prevent financial fraud.",
      icon: "credit-card",
    },
    {
      title: "Email Security Verification",
      description: "Check suspicious email links that claim to be from known companies requesting account verification or password resets.",
      icon: "envelope",
    },
    {
      title: "Social Media Link Verification",
      description: "Verify the safety of shortened URLs and suspicious links shared through social media platforms.",
      icon: "share-alt",
    },
    {
      title: "Online Shopping Protection",
      description: "When shopping online, verify that e-commerce sites are legitimate before providing personal and payment information.",
      icon: "shopping-cart",
    },
    {
      title: "Educational Awareness",
      description: "Educational institutions can use the tool to demonstrate phishing techniques and teach students about online safety.",
      icon: "graduation-cap",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <section className="py-16 bg-gradient-to-b from-primary-50 to-white">
          <div className="container mx-auto px-4">
            <h1 className="font-heading text-4xl font-bold text-center text-primary-800 mb-6">
              PhishHook AI Use Cases
            </h1>
            <p className="text-center text-neutral-700 max-w-3xl mx-auto mb-12">
              Our phishing detection tool can be applied in multiple scenarios to protect individuals and organizations
              from various types of phishing attacks.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {useCaseItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div
                    className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4"
                    aria-label={item.title}
                  >
                    <i className={`fas fa-${item.icon} text-primary-600`} aria-hidden="true"></i>
                  </div>
                  <h3 className="font-heading font-semibold text-xl mb-3">{item.title}</h3>
                  <p className="text-neutral-700">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <h2 className="font-heading text-2xl font-bold text-primary-800 mb-4">
                Ready to protect yourself?
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <a
                  href="/"
                  className="bg-primary-700 hover:bg-primary-800 text-white font-medium px-6 py-3 rounded-md transition-colors shadow-md"
                  aria-label="Go to Scanner"
                >
                  Go to Scanner
                </a>
                <a
                  href="/static/assets/Phishing Website Identification.pdf"
                  download="phishing-protection-guide"
                  className="bg-white border border-primary-700 text-primary-800 hover:bg-primary-50 font-medium px-6 py-3 rounded-md transition-colors shadow-md flex items-center justify-center gap-2"
                  aria-label="Download phishing protection guide"
                >
                  <span>Download Guide</span>
                  <i className="fas fa-download" aria-hidden="true"></i>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}