import React, { useState } from "react";

const ChatInterface = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle message submission
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      <div className="py-2 flex items-center gap-2 w-1/2 justify-end self-end">
        <span>Select Document :</span>
        <select
          name=""
          id=""
          className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></select>
      </div>
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

export default ChatInterface;
