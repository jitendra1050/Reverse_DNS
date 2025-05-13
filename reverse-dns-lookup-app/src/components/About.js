import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <h1>About Our DNS Lookup Tool</h1>
      <div className="about-content">
        <section className="about-section developer-story">
          <p className="intro-text">
            Welcome to our Reverse DNS Lookup tool — a simple, fast, and reliable utility built by a developer, for developers.
          </p>
          <p className="story-text">
            This project started as a personal hobby, born out of a need to quickly perform reverse DNS lookups during debugging and network analysis tasks. As a fellow developer, I understand how essential it is to have tools that just work — no clutter, no noise, just results.
          </p>
          <p className="purpose-text">
            Whether you're troubleshooting, verifying domains, or just exploring, this tool is designed to be efficient and developer-friendly. I built it to scratch my own itch, and I'm sharing it with the community in hopes it helps you too.
          </p>
          <p className="closing-text">
            Thanks for stopping by — and happy debugging!
          </p>
        </section>

        <section className="about-section">
          <h2>What is Reverse DNS Lookup?</h2>
          <p>
            Reverse DNS lookup (rDNS) is the process of finding the domain name associated with an IP address.
            This is the opposite of forward DNS lookup, which finds the IP address for a given domain name.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Tool's Features</h2>
          <ul>
            <li>Quick and accurate reverse DNS lookups</li>
            <li>Detailed geographic location information</li>
            <li>ISP and organization details</li>
            <li>Network information including ASN details</li>
            <li>User-friendly interface</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>How It Works</h2>
          <p>
            Our tool uses multiple reliable DNS servers and IP information services to provide comprehensive
            results. When you enter an IP address, we:
          </p>
          <ol>
            <li>Query Google's DNS servers for PTR records</li>
            <li>Fetch geographic and network information</li>
            <li>Combine and format the results for easy reading</li>
          </ol>
        </section>
      </div>
    </div>
  );
}

export default About; 