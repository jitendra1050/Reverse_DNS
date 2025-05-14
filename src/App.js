import React, { useState } from 'react';
import './App.css';
import { FaGlobe } from 'react-icons/fa';

function App() {
  const [ipAddress, setIpAddress] = useState('');
  const [dnsInfo, setDnsInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  const fetchReverseDns = async () => {
    setLoading(true);
    setError(null);
    try {
      // First, get PTR record from Google DNS API
      const ptrResponse = await fetch(`https://dns.google/resolve?name=${ipAddress.split('.').reverse().join('.')}.in-addr.arpa&type=PTR`);
      const ptrData = await ptrResponse.json();
      
      // Using a secure HTTPS endpoint for IP info
      const ipInfoResponse = await fetch(`https://ipapi.co/${ipAddress}/json/`);
      const ipInfo = await ipInfoResponse.json();
      
      console.log('PTR Response:', ptrData);
      console.log('IP Info Response:', ipInfo);
      
      setApiResponse({ ptr: ptrData, ipInfo: ipInfo });
      
      // Check for errors in ipapi.co response
      if (ipInfo.error) {
        throw new Error(ipInfo.reason || 'Failed to fetch IP information');
      }

      const formattedData = [
        {
          type: 'PTR',
          hostname: ptrData.Answer ? ptrData.Answer[0].data.slice(0, -1) : 'No PTR record found'
        },
        {
          type: 'Location',
          city: ipInfo.city || 'N/A',
          region: ipInfo.region || 'N/A',
          country: ipInfo.country_name || 'N/A'
        },
        {
          type: 'ISP',
          isp: ipInfo.org || 'N/A'
        },
        {
          type: 'Organization',
          org: ipInfo.org || 'N/A'
        },
        {
          type: 'Network',
          as: ipInfo.asn || 'N/A',
          asname: ipInfo.org || 'N/A'
        }
      ];
      setDnsInfo(formattedData);
    } catch (err) {
      console.error('Error details:', err);
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
    if (ipAddress) {
      fetchReverseDns();
    } else {
      setError('Please enter a valid IP address.');
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-brand">Reverse DNS Lookup</div>
        <ul className="navbar-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">Features</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
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
    </div>
  );
}

function formatIpInfo(info) {
  if (!info) return '';
  
  switch(info.type) {
    case 'PTR':
      return info.hostname || 'No PTR record found';
    case 'Location':
      return `${info.city}, ${info.region}, ${info.country}`;
    case 'ISP':
      return info.isp;
    case 'Organization':
      return info.org;
    case 'Network':
      return `AS${info.as} ${info.asname}`;
    default:
      return info.value || '';
  }
}

export default App; 