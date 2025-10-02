import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyLists = () => {
  const [myLists, setMyLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyLists();
  }, []);

  const fetchMyLists = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/lists/my-lists');
      setMyLists(response.data);
    } catch (error) {
      console.error('Error fetching my lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateItemStatus = async (distributionId, itemId, newStatus) => {
    try {
      
      console.log(`Updating item ${itemId} to ${newStatus}`);
      alert(`Item status updated to ${newStatus} (This is a demo - no actual update in backend)`);
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  if (loading) {
    return <div className="container">Loading your lists...</div>;
  }

  return (
    <div className="container">
      <h1>My Assigned Lists</h1>
      
      {myLists.length === 0 ? (
        <div className="card">
          <p>No lists assigned to you yet.</p>
        </div>
      ) : (
        myLists.map(distribution => (
          <div key={distribution._id} className="card">
            <h3>From: {distribution.originalName}</h3>
            <p><strong>Total items in distribution:</strong> {distribution.totalItems}</p>
            <p><strong>My assigned items:</strong> {distribution.items.length}</p>
            <p><strong>Uploaded by:</strong> {distribution.uploadedBy?.name}</p>
            
            <h4>My Items:</h4>
            <table className="table">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Phone</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {distribution.items.map(item => (
                  <tr key={item._id}>
                    <td>{item.firstName}</td>
                    <td>{item.phone}</td>
                    <td>{item.notes || '-'}</td>
                    <td>
                      <span className={`status ${item.status}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => updateItemStatus(distribution._id, item._id, 'completed')}
                        className="btn btn-success"
                        style={{ marginRight: '0.5rem' }}
                        disabled={item.status === 'completed'}
                      >
                        Mark Complete
                      </button>
                    </td>
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

export default MyLists;