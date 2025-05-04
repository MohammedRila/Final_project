import { useState, ReactNode } from "react";

interface FAQItem {
  id: string;
  icon: string;
  title: string;
  content: ReactNode;
}

interface AccordionFAQProps {
  items: FAQItem[];
  defaultOpen?: string;
}

export function AccordionFAQ({ items, defaultOpen }: AccordionFAQProps) {
  const [openItem, setOpenItem] = useState<string | null>(defaultOpen || null);

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {items.map(item => (
        <div 
          key={item.id}
          className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
        >
          <button 
            className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex items-center justify-between focus:outline-none"
            onClick={() => toggleItem(item.id)}
          >
            <div className="flex items-center">
              <i className={`fas fa-${item.icon} text-primary-600 mr-3`}></i>
              <span className="font-medium text-lg">{item.title}</span>
            </div>
            <i className={`fas fa-chevron-down text-gray-400 transform transition-transform duration-200 ${openItem === item.id ? 'rotate-180' : ''}`}></i>
          </button>
          <div 
            className={`px-6 py-4 bg-gray-50 border-t border-gray-200 ${openItem === item.id ? '' : 'hidden'}`}
          >
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
}
