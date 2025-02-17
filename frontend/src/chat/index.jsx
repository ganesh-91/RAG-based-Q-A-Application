import React, { useState } from 'react';
import axios from 'axios';

export const QAInterface = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [excerpts, setExcerpts] = useState([]);

  const handleQuestionSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/qa/ask',
        { question },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnswer(response.data.answer);
      setExcerpts(response.data.excerpts);
    } catch (error) {
      alert('Error asking question: ' + error.response.data.message);
    }
  };

  return (
    <div>
      <h1>Q&A Interface</h1>
      <input
        type="text"
        placeholder="Ask a question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={handleQuestionSubmit}>Submit</button>
      <h2>Answer:</h2>
      <p>{answer}</p>
      <h2>Relevant Excerpts:</h2>
      <ul>
        {excerpts.map((excerpt, index) => (
          <li key={index}>{excerpt}</li>
        ))}
      </ul>
    </div>
  );
};

export default QAInterface;