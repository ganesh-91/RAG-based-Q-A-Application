import React, { useState } from 'react';
import axios from 'axios';

export const DocumentManagement = () => {
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/documents/upload', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('File uploaded successfully!');
    } catch (error) {
      alert('Error uploading file: ' + error.response.data.message);
    }
  };

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/documents', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(response.data);
    } catch (error) {
      alert('Error fetching documents: ' + error.response.data.message);
    }
  };

  return (
    <div>
      <h1>Document Management</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <button onClick={fetchDocuments}>Refresh Documents</button>
      <ul>
        {documents.map((doc) => (
          <li key={doc._id}>{doc.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentManagement;