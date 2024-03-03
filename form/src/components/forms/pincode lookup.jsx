import React, { useState } from 'react';
import axios from 'axios';

const PincodeLookup = () => {
  const [pincode, setPincode] = useState('');
  const [postOfficeData, setPostOfficeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePincodeChange = (event) => {
    setPincode(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
    if (event.target.value === '') {
      setFilteredData(postOfficeData);
    } else {
      setFilteredData(
        postOfficeData.filter((item) =>
          item.PostOffice.Name.toLowerCase().includes(event.target.value.toLowerCase())
        )
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (pincode.length !== 6) {
      setError('Please enter a valid 6-digit pincode.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      if (response.data[0].PostOffice.length === 0) {
        setError('Couldn’t find the postal data you’re looking for…');
      } else {
        setPostOfficeData(response.data[0].PostOffice);
        setFilteredData(response.data[0].PostOffice);
      }
    } catch (err) {
      setError('An error occurred while fetching data from the API.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pincode-lookup">
      <h1>Pincode Lookup</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={pincode} onChange={handlePincodeChange} placeholder="Enter pincode" />
        <button type="submit">Lookup</button>
      </form>
      
      {error && <p>{error}</p>}
      {isLoading ? (
        <div className="loader" />
      ) : (
        <ul className="post-office-list">
          {filteredData.map((item) => (
            <li key={item.Name}>
              <h2>{item.Name}</h2>
              <p>Branch Type: {item.BranchType} - Delivery Status: {item.DeliveryStatus}</p>
              <p>District: {item.District}</p>
              <p>State: {item.State}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PincodeLookup;