import React, { useState } from 'react';
import { Upload } from 'lucide-react';

// Main App Component
const RagPdfChat = () => {
  return (
    <div className="w-full h-screen flex">
      <Sidebar />
      <MainContent />
    </div>
  );
};

// Sidebar Component
const Sidebar = () => {
  return (
    <div className="w-72 bg-gray-50 p-6 border-r border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Menu:</h2>
      <p className="text-sm text-gray-600 mb-4">
        Upload your PDF Files and Click on the Submit & Process Button
      </p>
      <FileUpload />
    </div>
  );
};

// File Upload Component
const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop logic here
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-2">
          <Upload className="w-8 h-8 text-gray-400" />
          <p className="text-sm text-gray-600">Drag and drop files here</p>
          <p className="text-xs text-gray-400">Limit 200MB per file</p>
        </div>
      </div>
      
      <button className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
        Browse files
      </button>
      
      <button className="w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
        Submit & Process
      </button>
    </div>
  );
};

// Main Content Component
const MainContent = () => {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-6">RAG based Chat with PDF</h1>
      <div className="space-y-4">
        <p className="text-gray-600">Ask a Question from the PDF Files</p>
        <ChatInterface />
      </div>
    </div>
  );
};

// Chat Interface Component
const ChatInterface = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle message submission
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4">
        {/* Chat messages will go here */}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your question here..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default RagPdfChat;