import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './FAQ.css';

const faqData = [
  // Basic Information
  {
    question: "What is reverse DNS lookup and how does it work?",
    answer: "Reverse DNS lookup is a DNS query that finds domain names associated with an IP address.\n\nHow it works:\n• Converts IP address to special format (.in-addr.arpa)\n• Queries DNS servers for PTR records\n• Returns associated domain name(s)\n\nExample: 8.8.8.8 → google-public-dns-a.google.com"
  },
  {
    question: "How do I perform a reverse DNS lookup for an IP address?",
    answer: "To perform a reverse DNS lookup:\n\n1. Enter the IP address in our search box above\n2. Click 'Fetch Reverse DNS'\n3. View the results showing:\n   • Domain name (PTR record)\n   • Location data\n   • Network information\n   • ISP details"
  },
  {
    question: "Can I find a domain name from an IP address using reverse DNS?",
    answer: "Yes, you can find domain names from IP addresses using reverse DNS.\n\nOur tool will:\n• Look up the PTR record\n• Show associated domain names\n• Display additional network info\n\nNote: Some IPs may not have associated domain names."
  },

  // Technical Details
  {
    question: "What is the difference between forward and reverse DNS lookup?",
    answer: "Key differences:\n\n• Forward DNS: Domain → IP address\n• Reverse DNS: IP address → Domain\n\nExample:\nForward: example.com → 93.184.216.34\nReverse: 93.184.216.34 → example.com\n\nUsage:\n• Forward: Website browsing\n• Reverse: Email verification, security checks"
  },
  {
    question: "What are PTR records in reverse DNS lookup?",
    answer: "PTR (Pointer) records are DNS entries that:\n\n• Map IP addresses to domain names\n• Are stored in .in-addr.arpa zone\n• Used primarily for reverse DNS lookups\n\nPurpose:\n• Email server verification\n• Network troubleshooting\n• Security validation"
  },
  {
    question: "Is reverse DNS lookup supported for IPv6 addresses?",
    answer: "Yes, IPv6 reverse DNS is supported.\n\nKey points:\n• Uses ip6.arpa domain (instead of in-addr.arpa)\n• Requires different formatting\n• Works similarly to IPv4 reverse DNS\n\nNote: Our tool supports both IPv4 and IPv6 lookups."
  },

  // Usage and Tools
  {
    question: "What tools can I use for reverse DNS lookup online?",
    answer: "Popular online tools include:\n\n• Our web-based tool (free and easy)\n• Command-line tools (nslookup, dig)\n• Professional DNS tools\n• Network monitoring services\n\nOur tool provides:\n• User-friendly interface\n• Comprehensive results\n• No installation needed"
  },
  {
    question: "How to do a reverse DNS lookup using command line?",
    answer: "Command line methods:\n\nWindows (nslookup):\n• nslookup IP_ADDRESS\n\nLinux/Mac (dig):\n• dig -x IP_ADDRESS\n\nAlternative (host):\n• host IP_ADDRESS"
  },
  {
    question: "How to check reverse DNS lookup on Mac/Linux/Windows?",
    answer: "Platform-specific methods:\n\nMac/Linux:\n• Terminal: dig -x IP_ADDRESS\n• Terminal: host IP_ADDRESS\n\nWindows:\n• CMD: nslookup IP_ADDRESS\n• PowerShell: Resolve-DnsName IP_ADDRESS"
  },

  // Applications and Benefits
  {
    question: "Why is reverse DNS lookup important for email servers?",
    answer: "Email server benefits:\n\n• Spam prevention\n• Server authentication\n• Mail delivery verification\n\nImportance:\n• Required by many mail servers\n• Reduces spam acceptance\n• Improves email deliverability"
  },
  {
    question: "Can reverse DNS lookup help detect spam or malicious IPs?",
    answer: "Yes, reverse DNS helps security:\n\n• Identifies suspicious servers\n• Validates email senders\n• Flags mismatched records\n\nSecurity uses:\n• Spam detection\n• Network monitoring\n• Threat assessment"
  },

  // Troubleshooting
  {
    question: "How do I troubleshoot failed reverse DNS lookups?",
    answer: "Troubleshooting steps:\n\n1. Check IP address format\n2. Verify network connectivity\n3. Try alternative DNS servers\n4. Check for PTR record existence\n\nCommon issues:\n• Missing PTR records\n• DNS server problems\n• Network connectivity"
  },
  {
    question: "What does it mean if reverse DNS lookup fails?",
    answer: "Common reasons for failure:\n\n• No PTR record exists\n• DNS server issues\n• Network problems\n\nImplications:\n• Email delivery issues\n• Authentication failures\n• Security flag raising"
  },

  // Commercial Aspects
  {
    question: "Is reverse DNS lookup free to use online?",
    answer: "Our service is free with features:\n\n• Unlimited basic lookups\n• No registration required\n• Full result details\n\nLimitations:\n• Fair usage policy applies\n• Bulk lookup restrictions\n• API usage may be charged"
  },
  {
    question: "How accurate is reverse DNS lookup for identifying domains?",
    answer: "Accuracy factors:\n\n• PTR record maintenance\n• DNS server updates\n• Administrator configuration\n\nReliability:\n• Very accurate for properly configured servers\n• May not always reflect current domain\n• Updates can take time to propagate"
  }
];

function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleAnswer = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Add FAQ Schema for SEO
  React.useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer.replace(/\n/g, ' ')
        }
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="faq-container">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqData.map((faq, index) => (
          <div 
            key={index} 
            className={`faq-item ${expandedIndex === index ? 'expanded' : ''}`}
          >
            <button 
              className="faq-question" 
              onClick={() => toggleAnswer(index)}
              aria-expanded={expandedIndex === index}
            >
              <span>{faq.question}</span>
              {expandedIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ; 