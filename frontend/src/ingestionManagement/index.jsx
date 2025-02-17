import React, { useState } from 'react';
import axios from 'axios';

export const IngestionManagement = () => {
  const [status, setStatus] = useState('');

  const triggerIngestion = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/ingestion/trigger', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus(response.data.status);
    } catch (error) {
      alert('Error triggering ingestion: ' + error.response.data.message);
    }
  };

  return (
    <div>
      <h1>Ingestion Management</h1>
      <button onClick={triggerIngestion}>Trigger Ingestion</button>
      <p>Status: {status}</p>
    </div>
  );
};

export default IngestionManagement;