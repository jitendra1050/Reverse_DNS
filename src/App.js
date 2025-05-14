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
      // Get PTR record from Google DNS API
      const ptrResponse = await fetch(`https://dns.google/resolve?name=${ipAddress.split('.').reverse().join('.')}.in-addr.arpa&type=PTR`);
      const ptrData = await ptrResponse.json();
      
      console.log('PTR Response:', ptrData);
      
      setApiResponse({ ptr: ptrData });
      
      if (!ptrData.Answer) {
        throw new Error('No PTR record found for this IP address');
      }

      const formattedData = [
        {
          type: 'PTR Record',
          hostname: ptrData.Answer[0].data.slice(0, -1)
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
        <p>Convert IP addresses to hostnames. A simple and fast DNS lookup tool for network troubleshooting.</p>
      </header>
      <div className="hero">
        <h2>DNS Lookup Made Simple</h2>
        <p>Quickly fetch reverse DNS records for any IP address.</p>
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
          <h2>DNS Information</h2>
          <p className="record-description">DNS record for IP address: {ipAddress}</p>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Hostname</th>
                </tr>
              </thead>
              <tbody>
                {dnsInfo.map((info, index) => (
                  <tr key={index}>
                    <td><FaGlobe /> {info.type}</td>
                    <td className="data-cell">{info.hostname}</td>
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

export default App;