import React, { useState, Suspense } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import { FaGlobe } from 'react-icons/fa';
import About from './components/About';
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import Breadcrumbs from './components/Breadcrumbs';
import LoadingSkeleton from './components/LoadingSkeleton';
import logo from './assets/logo.svg';

const REVERSE_DNS_INFO = {
  'PTR': 'Pointer Record - Maps an IP address to a domain name',
  'Location': 'Geographic location of the IP address',
  'ISP': 'Internet Service Provider information',
  'Organization': 'Organization owning the IP address',
  'Network': 'Network information including ASN details'
};

function formatIpInfo(data) {
  if (!data) return '';
  
  switch(data.type) {
    case 'PTR':
      return data.hostname || 'No PTR record found';
    case 'Location':
      return `${data.city}, ${data.region}, ${data.country}`;
    case 'ISP':
      return data.isp;
    case 'Organization':
      return data.org;
    case 'Network':
      return `AS${data.as} ${data.asname}`;
    default:
      return data.value || '';
  }
}

function Home({ ipAddress, setIpAddress, dnsInfo, loading, error, apiResponse, handleInputChange, handleSubmit }) {
  return (
    <main className="main-content">
      <header className="App-header">
        <h1>Reverse DNS Lookup Tool</h1>
        <p>Convert IP addresses to hostnames and get detailed network information. Useful for network troubleshooting, email verification, and security analysis.</p>
      </header>
      
      <section className="hero">
        <h2>Your IP Information, Simplified</h2>
        <p>Quickly fetch reverse DNS records and network details for any IP address.</p>
        <button className="cta-button">Get Started</button>
      </section>
      
      <section className="lookup-form">
        <form onSubmit={handleSubmit} role="search">
          <label htmlFor="ip-input" className="visually-hidden">Enter IP address</label>
          <input
            id="ip-input"
            type="text"
            value={ipAddress}
            onChange={handleInputChange}
            placeholder="Enter IP address (e.g., 8.8.8.8)"
            aria-label="IP address input"
          />
          <button type="submit" aria-label="Perform DNS lookup">Fetch Reverse DNS</button>
        </form>
      </section>

      {loading && <LoadingSkeleton />}
      
      {error && (
        <section className="error" role="alert">
          <p>{error}</p>
        </section>
      )}
      
      {dnsInfo.length > 0 && (
        <section className="record-group" role="region" aria-label="DNS lookup results">
          <h2>IP Information</h2>
          <p className="record-description">Detailed information about IP address: {ipAddress}</p>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Information</th>
                </tr>
              </thead>
              <tbody>
                {dnsInfo.map((info, index) => (
                  <tr key={index}>
                    <td><FaGlobe aria-hidden="true" /> {info.type}</td>
                    <td className="data-cell">{formatIpInfo(info)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      
      {apiResponse && (
        <section className="api-response">
          <h3>API Response</h3>
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </section>
      )}

      {!dnsInfo.length && !loading && (
        <section className="home-faq-section">
          <FAQ />
        </section>
      )}
    </main>
  );
}

function App() {
  const [ipAddress, setIpAddress] = useState('');
  const [dnsInfo, setDnsInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const location = useLocation();

  const fetchReverseDns = async (ip) => {
    setLoading(true);
    setError(null);
    try {
      // Use the cleaned IP address
      const cleanedIp = ip.trim().replace(/\s+/g, '');
      console.log('Cleaned IP:', cleanedIp);

      const dnsUrl = `https://dns.google/resolve?name=${cleanedIp.split('.').reverse().join('.')}.in-addr.arpa&type=PTR`;
      console.log('Making request to:', dnsUrl);

      const ptrResponse = await fetch(dnsUrl);
      const ptrData = await ptrResponse.json();
      
      console.log('Full PTR Response:', ptrData);
      
      setApiResponse({ ptr: ptrData });
      
      if (!ptrData.Answer) {
        console.log('No Answer section in response');
        throw new Error('No PTR record found for this IP address');
      }

      const hostname = ptrData.Answer[0].data.slice(0, -1);
      console.log('Extracted hostname:', hostname);

      const formattedData = [
        {
          type: 'PTR',
          hostname: hostname
        }
      ];

      console.log('Formatted data to be set:', formattedData);
      setDnsInfo(formattedData);
    } catch (err) {
      console.error('Detailed error information:', {
        message: err.message,
        stack: err.stack,
        fullError: err
      });
      setError(`Error: ${err.message || 'An error occurred while fetching reverse DNS information.'}`);
      setDnsInfo([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setIpAddress(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Remove all spaces from the IP address, including spaces between numbers and dots
    const cleanIp = ipAddress.replace(/\s+/g, '');
    
    if (!cleanIp) {
      setError('Please enter an IP address.');
      return;
    }

    // Update state with clean IP before fetching
    setIpAddress(cleanIp);
    fetchReverseDns(cleanIp);
  };

  return (
    <div className="App">
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="nav-brand">
          <Link to="/">
            <img src={logo} alt="Reverse DNS Lookup" className="nav-logo" />
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About</Link>
          <Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>Contact Us</Link>
        </div>
      </nav>

      <Breadcrumbs />
      
      <Suspense fallback={<LoadingSkeleton />}>
        <Routes>
          <Route path="/" element={
            <Home 
              ipAddress={ipAddress}
              setIpAddress={setIpAddress}
              dnsInfo={dnsInfo}
              loading={loading}
              error={error}
              apiResponse={apiResponse}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
            />
          } />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>

      <footer className="site-footer">
        <p>&copy; 2024 Reverse DNS Lookup Tool. Created by Jitendra Thakur</p>
      </footer>
    </div>
  );
}

export default App;
