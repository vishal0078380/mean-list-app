import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAgents: 0,
    totalDistributions: 0,
    totalItems: 0,
    myAssignedItems: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
     
      if (!user) {
        return;
      }
      try {
        if (user.role === 'admin') {
          const [agentsRes, distributionsRes] = await Promise.all([
            axios.get('http://localhost:5001/api/agents'),
            axios.get('http://localhost:5001/api/lists')
          ]);

          const totalItems = distributionsRes.data.reduce((sum, dist) => sum + dist.totalItems, 0);

          setStats({
            totalAgents: agentsRes.data.length,
            totalDistributions: distributionsRes.data.length,
            totalItems: totalItems,
            myAssignedItems: 0
          });
        } else {
          const myListsRes = await axios.get('http://localhost:5001/api/lists/my-lists');
          const myAssignedItems = myListsRes.data.reduce((sum, list) => sum + list.items.length, 0);

          setStats({
            totalAgents: 0,
            totalDistributions: 0,
            totalItems: 0,
            myAssignedItems: myAssignedItems
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [user]); 

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <p>Welcome back, {user?.name}!</p>

      <div className="dashboard-stats">
        {user?.role === 'admin' ? (
          <>
            <div className="stat-card">
              <div className="stat-number">{stats.totalAgents}</div>
              <div className="stat-label">Total Agents</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalDistributions}</div>
              <div className="stat-label">List Distributions</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalItems}</div>
              <div className="stat-label">Total Items Distributed</div>
            </div>
          </>
        ) : (
     
          <div className="stat-card">
            <div className="stat-number">{stats.myAssignedItems}</div>
            <div className="stat-label">My Assigned Items</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;