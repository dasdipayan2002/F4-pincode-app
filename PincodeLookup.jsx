import React, { useState } from 'react';
import axios from 'axios';
import Loader from 'react-loader-spinner';
import './PincodeLookup.css';

const PincodeLookup = () => {
  const [pincode, setPincode] = useState('');
  const [filter, setFilter] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLookup = async () => {
    if (pincode.length !== 6) {
      setError('The code is not 6 digits');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      const result = response.data[0];
      if (result.Status === 'Error') {
        setError('Error fetching data');
        setData([]);
      } else {
        setData(result.PostOffice);
      }
    } catch (err) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((postOffice) =>
    postOffice.Name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="pincode-lookup">
      <input
        type="text"
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
        placeholder="Enter 6-digit pincode"
      />
      <button onClick={handleLookup}>Lookup</button>

      {loading && <Loader type="ThreeDots" color="#00BFFF" height={80} width={80} />}

      {error && <div className="error">{error}</div>}

      {data.length > 0 && (
        <>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by post office name"
          />
          <div className="results">
            {filteredData.length > 0 ? (
              filteredData.map((postOffice) => (
                <div key={postOffice.Name} className="post-office">
                  <div><strong>Post Office Name:</strong> {postOffice.Name}</div>
                  <div><strong>Pincode:</strong> {postOffice.Pincode}</div>
                  <div><strong>District:</strong> {postOffice.District}</div>
                  <div><strong>State:</strong> {postOffice.State}</div>
                </div>
              ))
            ) : (
              <div className="error">Couldn’t find the postal data you’re looking for…</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PincodeLookup;
