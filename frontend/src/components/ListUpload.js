import React, { useState } from 'react';
import axios from 'axios';

const ListUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop().toLowerCase();
      if (['csv', 'xlsx', 'xls'].includes(fileExt)) {
        setFile(selectedFile);
        setMessage('');
      } else {
        setMessage('Please select a CSV, XLSX, or XLS file');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5001/api/lists/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('File uploaded and distributed successfully!');
      setFile(null);
      document.getElementById('file-input').value = '';
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container">
      <h1>Upload List</h1>
      
      <div className="card">
        <h2>Upload CSV/Excel File</h2>
        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="file-upload">
            <input
              type="file"
              id="file-input"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
            />
            <label htmlFor="file-input" className="file-upload-label">
              {file ? `Selected: ${file.name}` : 'Choose CSV, XLSX, or XLS file'}
            </label>
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <p><strong>File Requirements:</strong></p>
            <ul style={{ textAlign: 'left', marginLeft: '2rem' }}>
              <li>Accepted formats: CSV, XLSX, XLS</li>
              <li>Required columns: FirstName, Phone</li>
              <li>Optional columns: Notes</li>
              <li>Maximum file size: 5MB</li>
            </ul>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={uploading || !file}
            style={{ marginTop: '1rem' }}
          >
            {uploading ? 'Uploading...' : 'Upload & Distribute'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ListUpload;