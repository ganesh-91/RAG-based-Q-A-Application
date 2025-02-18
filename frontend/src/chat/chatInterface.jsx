import axios from "axios";
import React, { useState } from "react";
import { Bot, User } from 'lucide-react';

const ChatInterface = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse(prev => [...prev, { user: 'user', msg: query }])
    setQuery('')
    try {
      const data = {
        query: query
      };

      axios.post('http://127.0.0.1:8000/api/ask', data, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          console.log('Response:', response.data.answer.result); // Handle successful response
          setResponse(prev => [...prev, { user: 'agent', msg: response.data.answer.result }])
        })
        .catch(error => {
          console.error('Error:', error); // Handle errors
        });
    } catch (error) {
      alert("Error uploading file: " + error.response.data.query);
    }
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
      <div className="flex-1 bg-gray-200 rounded-lg p-4 mb-4">
        {/* Chat messages will go here */}
        {response.map((resp) => {
          return (
            <div className={`flex-1 bg-gray-50 rounded-lg p-4 mb-4 ${resp.user === 'user' ? 'ml-8' : 'mr-8'}`}>
              {resp.user === 'user' ? <User /> : <Bot />}
              {resp.msg}
            </div>
          )
        })}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
