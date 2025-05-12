import React from 'react';
import './Contact.css';
import { FaEnvelope } from 'react-icons/fa';

function Contact() {
  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      
      <div className="contact-content">
        <section className="contact-intro">
          <p>
            Got feedback, feature requests, or spotted a bug? I'd love to hear from you!
          </p>
          <p>
            This Reverse DNS Lookup tool is a solo developer project aimed at making life easier for fellow devs. 
            Whether you're reaching out with a question, suggestion, or just a quick hello, feel free to drop a message below or email me directly.
          </p>
          <p>
            I'll do my best to get back to you as soon as I can. Thanks for using the tool!
          </p>
          
          <div className="email-section">
            <FaEnvelope className="email-icon" />
            <a href="mailto:jitendrathakur2611@gmail.com">jitendrathakur2611@gmail.com</a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Contact; 