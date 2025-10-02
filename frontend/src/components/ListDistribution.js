import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListDistribution = () => {
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDistributions();
  }, []);

  const fetchDistributions = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/lists');
      setDistributions(response.data);
    } catch (error) {
      console.error('Error fetching distributions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Loading distributions...</div>;
  }

  return (
    <div className="container">
      <h1>List Distributions</h1>
      
      {distributions.length === 0 ? (
        <div className="card">
          <p>No distributions found.</p>
        </div>
      ) : (
        distributions.map(distribution => (
          <div key={distribution._id} className="card">
            <h3>{distribution.originalName}</h3>
            <p><strong>Uploaded by:</strong> {distribution.uploadedBy?.name}</p>
            <p><strong>Total Items:</strong> {distribution.totalItems}</p>
            <p><strong>Uploaded on:</strong> {new Date(distribution.createdAt).toLocaleString()}</p>
            
            <h4>Distribution by Agent:</h4>
            <table className="table">
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Assigned Items</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(
                  distribution.distributedItems.reduce((acc, item) => {
                    const agentName = item.agent?.name || 'Unknown Agent';
                    acc[agentName] = (acc[agentName] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([agentName, count]) => (
                  <tr key={agentName}>
                    <td>{agentName}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default ListDistribution;