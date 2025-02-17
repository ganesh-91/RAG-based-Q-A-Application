import React, { useState } from "react";
import axios from "axios";
import ChatInterface from "./chatInterface";

export const QAInterface = () => {
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

export default QAInterface;
