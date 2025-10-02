import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Agents from './components/Agents';
import ListUpload from './components/ListUpload';
import ListDistribution from './components/ListDistribution';
import MyLists from './components/MyLists';
import Navbar from './components/Navbar';
import './App.css';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/my-lists" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Navbar />
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/agents" element={
              <ProtectedRoute adminOnly={true}>
                <Navbar />
                <Agents />
              </ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute adminOnly={true}>
                <Navbar />
                <ListUpload />
              </ProtectedRoute>
            } />
            <Route path="/distributions" element={
              <ProtectedRoute adminOnly={true}>
                <Navbar />
                <ListDistribution />
              </ProtectedRoute>
            } />
            <Route path="/my-lists" element={
              <ProtectedRoute>
                <Navbar />
                <MyLists />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;