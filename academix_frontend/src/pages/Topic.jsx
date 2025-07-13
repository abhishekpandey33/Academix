import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { chatWithBot } from '../api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Topic() {
  const { topicId } = useParams();
  const course = JSON.parse(localStorage.getItem('course'));
  const [topic, setTopic] = useState(null);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    for (const m of course.modules) {
      const found = m.topics.find((t) => t.id == topicId);
      if (found) setTopic(found);
    }
  }, [topicId]);

  const handleAsk = async () => {
    const res = await chatWithBot(topic.id, message);
    setChat([...chat, { q: message, a: res.data.reply }]);
    setMessage('');
  };

  const downloadPDF = () => {
    const input = document.getElementById('topic-content');
    html2canvas(input).then((canvas) => {
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(img, 'PNG', 10, 10);
      pdf.save(`${topic.title}.pdf`);
    });
  };

  if (!topic) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div id="topic-content">
        <h2 className="text-xl font-semibold mb-2">{topic.title}</h2>
        <p>{topic.content || 'AI content will be shown here soon.'}</p>
      </div>
      <button onClick={downloadPDF} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
        Download PDF
      </button>

      <div className="mt-6">
        <h3 className="font-bold mb-2">Need Help? Ask the chatbot:</h3>
        <div className="flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border p-2 flex-1"
            placeholder="Ask your question here"
          />
          <button
            onClick={handleAsk}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Ask
          </button>
        </div>
        <div className="mt-4">
          {chat.map((c, i) => (
            <div key={i} className="mb-2">
              <p><strong>You:</strong> {c.q}</p>
              <p><strong>AI:</strong> {c.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
