import { AccordionFAQ } from "../ui/accordion-faq";

const faqItems = [
  {
    id: "faq-1",
    icon: "question-circle",
    title: "What is phishing?",
    content: (
      <>
        <p className="text-neutral-700">
          Phishing is a cybercrime in which a target or targets are contacted by email, telephone, or text message by someone posing as a legitimate institution to lure individuals into providing sensitive data such as personally identifiable information, banking and credit card details, and passwords.
        </p>
        <p className="text-neutral-700 mt-2">
          Alternatively, phishing is a cyber attack where the attacker tricks the target into disclosing personal information, revealing login credentials, or transferring money.
        </p>
      </>
    )
  },
  {
    id: "faq-2",
    icon: "shield-alt",
    title: "Why should I bother knowing what phishing is all about?",
    content: (
      <>
        <p className="text-neutral-700">
          The purpose of phishing is to collect sensitive information with the intention of using that information to gain access to otherwise protected data, networks, etc. A phisher's success is contingent upon establishing trust with its victims.
        </p>
        <p className="font-medium mt-4 mb-2">Successful phishing attacks can:</p>
        <ul className="space-y-2">
          <li className="flex items-start">
            <i className="fas fa-circle-check text-primary-600 mt-1 mr-3"></i>
            <span>Cause financial loss for victims</span>
          </li>
          <li className="flex items-start">
            <i className="fas fa-circle-check text-primary-600 mt-1 mr-3"></i>
            <span>Put their personal information at risk</span>
          </li>
          <li className="flex items-start">
            <i className="fas fa-circle-check text-primary-600 mt-1 mr-3"></i>
            <span>Put data and systems at risk</span>
          </li>
        </ul>
      </>
    )
  },
  {
    id: "faq-3",
    icon: "fish",
    title: "Types of Phishing Attacks",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium flex items-center">
            <i className="fas fa-angle-right text-primary-600 mr-2"></i>
            Deceptive Phishing
          </h4>
          <p className="ml-6 text-neutral-700">Deceptive phishing is by far the most common type of phishing scam. In this ploy, fraudsters impersonate a legitimate company to steal people's personal data or login credentials. Those emails frequently use threats and a sense of urgency to scare users into doing what the attackers want.</p>
        </div>
        
        <div>
          <h4 className="font-medium flex items-center">
            <i className="fas fa-angle-right text-primary-600 mr-2"></i>
            Spear Phishing
          </h4>
          <p className="ml-6 text-neutral-700">Spear Phishing targets specific individuals instead of a wide group of people. Attackers often research their victims on social media and other sites. That way, they can customize their communications and appear more authentic.</p>
        </div>
        
        <h4 className="font-medium mt-6 mb-3">Other phishing techniques:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-medium flex items-center">
              <i className="fas fa-angle-right text-primary-600 mr-2"></i>
              Angler Phishing
            </h5>
            <p className="ml-6 text-sm text-neutral-700">This cyberattack comes by way of social media. It may involve fake URLs, instant messages or profiles used to obtain sensitive data.</p>
          </div>
          
          <div>
            <h5 className="font-medium flex items-center">
              <i className="fas fa-angle-right text-primary-600 mr-2"></i>
              Clone Phishing
            </h5>
            <p className="ml-6 text-sm text-neutral-700">Clone phishing involves exact duplication of an email to make it appear as legitimate as possible.</p>
          </div>
          
          <div>
            <h5 className="font-medium flex items-center">
              <i className="fas fa-angle-right text-primary-600 mr-2"></i>
              Domain Spoofing
            </h5>
            <p className="ml-6 text-sm text-neutral-700">In this category of phishing, the attacker forges a company domain, which makes the email appear to be from that company.</p>
          </div>
          
          <div>
            <h5 className="font-medium flex items-center">
              <i className="fas fa-angle-right text-primary-600 mr-2"></i>
              Search Engine Phishing
            </h5>
            <p className="ml-6 text-sm text-neutral-700">Rather than sending correspondence to you to gain information, search engine fishing involves creating a website that mimics a legitimate site.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "faq-4",
    icon: "user-shield",
    title: "How to prevent and protect against phishing",
    content: (
      <div className="space-y-4">
        <p className="text-neutral-700">
          To help prevent phishing attacks, you should observe general best practices, similar to those you might undertake to avoid viruses and other malware:
        </p>
        
        <ul className="space-y-3">
          <li className="flex items-start">
            <i className="fas fa-check-circle text-success-500 mt-1 mr-3"></i>
            <span>Keep your systems updated to help protect against known vulnerabilities</span>
          </li>
          <li className="flex items-start">
            <i className="fas fa-check-circle text-success-500 mt-1 mr-3"></i>
            <span>Protect devices and systems with reputable security software and firewall protection</span>
          </li>
          <li className="flex items-start">
            <i className="fas fa-check-circle text-success-500 mt-1 mr-3"></i>
            <span>Be cautious about clicking on links or downloading attachments in emails, especially from unknown senders</span>
          </li>
          <li className="flex items-start">
            <i className="fas fa-check-circle text-success-500 mt-1 mr-3"></i>
            <span>Verify the sender's email address and website URLs before taking any action</span>
          </li>
          <li className="flex items-start">
            <i className="fas fa-check-circle text-success-500 mt-1 mr-3"></i>
            <span>Use our PhishHook AI tool to check suspicious URLs before visiting them</span>
          </li>
        </ul>
        
        <div className="mt-4 flex justify-center">
          <a 
            href="/static/assets/Phishing Website Identification.pdf" 
            download="phishing-protection-guide" 
            className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white px-6 py-3 rounded-md transition-colors shadow-md"
          >
            <span>Download Our Complete Protection Guide</span>
            <i className="fas fa-download"></i>
          </a>
        </div>
      </div>
    )
  }
];

export function About() {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-center text-primary-800 mb-12">Understanding Phishing Attacks</h2>
          
          <AccordionFAQ items={faqItems} defaultOpen="faq-1" />
        </div>
      </div>
    </section>
  );
}
