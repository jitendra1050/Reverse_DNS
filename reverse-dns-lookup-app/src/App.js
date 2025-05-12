import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import { FaGlobe } from 'react-icons/fa';
import About from './components/About';
import Contact from './components/Contact';
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
    <>
      <header className="App-header">
        <h1>Reverse DNS Lookup Tool</h1>
        <p>Convert IP addresses to hostnames and get detailed network information. Useful for network troubleshooting, email verification, and security analysis.</p>
      </header>
      <div className="hero">
        <h2>Your IP Information, Simplified</h2>
        <p>Quickly fetch reverse DNS records and network details for any IP address.</p>
        <button className="cta-button">Get Started</button>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={ipAddress}
          onChange={handleInputChange}
          placeholder="Enter IP address (e.g., 8.8.8.8)"
        />
        <button type="submit">Fetch Reverse DNS</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {dnsInfo.length > 0 && (
        <div className="record-group">
          <h2>IP Information</h2>
          <p className="record-description">Detailed information about IP address: {ipAddress}</p>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Information</th>
                </tr>
              </thead>
              <tbody>
                {dnsInfo.map((info, index) => (
                  <tr key={index}>
                    <td><FaGlobe /> {info.type}</td>
                    <td className="data-cell">{formatIpInfo(info)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {apiResponse && (
        <div className="api-response">
          <h3>API Response</h3>
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </div>
      )}
    </>
  );
}

function App() {
  const [ipAddress, setIpAddress] = useState('');
  const [dnsInfo, setDnsInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const location = useLocation();

  const fetchReverseDns = async () => {
    setLoading(true);
    setError(null);
    try {
      // First, get PTR record from Google DNS API
      const ptrResponse = await fetch(`https://dns.google/resolve?name=${ipAddress.split('.').reverse().join('.')}.in-addr.arpa&type=PTR`);
      const ptrData = await ptrResponse.json();
      
      // Then get additional information from IP-API
      const ipInfoResponse = await fetch(`http://ip-api.com/json/${ipAddress}`);
      const ipInfo = await ipInfoResponse.json();
      
      setApiResponse({ ptr: ptrData, ipInfo: ipInfo });
      
      if (ipInfo.status === 'success') {
        const formattedData = [
          {
            type: 'PTR',
            hostname: ptrData.Answer ? ptrData.Answer[0].data.slice(0, -1) : null
          },
          {
            type: 'Location',
            city: ipInfo.city,
            region: ipInfo.regionName,
            country: ipInfo.country
          },
          {
            type: 'ISP',
            isp: ipInfo.isp
          },
          {
            type: 'Organization',
            org: ipInfo.org
          },
          {
            type: 'Network',
            as: ipInfo.as.split('AS')[1],
            asname: ipInfo.asname
          }
        ];
        setDnsInfo(formattedData);
      } else {
        setError('Failed to fetch IP information.');
      }
    } catch (err) {
      setError('An error occurred while fetching reverse DNS information.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setIpAddress(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ipAddress) {
      fetchReverseDns();
    } else {
      setError('Please enter a valid IP address.');
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">
            <img src={logo} alt="Reverse DNS Lookup" className="nav-logo" />
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
          <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About</Link>
          <Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>Contact Us</Link>
        </div>
      </nav>
      
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
    </div>
  );
}

export default App;
