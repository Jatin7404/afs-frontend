import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

function Bookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://afs-backend-x5k5.onrender.com/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarks(response.data.bookmarks);
      setLoading(false);
    } catch (err) {
      setError('Failed to load bookmarks');
      setLoading(false);
    }
  };

  const removeBookmark = async (questionId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/profile/bookmark/${questionId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarks(bookmarks.filter(q => q._id !== questionId));
    } catch (err) {
      setError('Failed to remove bookmark');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Bookmarked Questions</h1>

      {bookmarks.length === 0 ? (
        <p className="text-gray-500 text-center">No bookmarked questions yet</p>
      ) : (
        <div className="grid gap-6">
          {bookmarks.map((question) => (
            <div key={question._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mb-2">
                    {question.type}
                  </span>
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {question.difficulty}
                  </span>
                  <h3 className="text-lg font-medium text-gray-900 mt-2">{question.question}</h3>
                  {question.type === 'quiz' && (
                    <div className="mt-4 space-y-2">
                      {question.options.map((option, index) => (
                        <div key={index} className="flex items-center">
                          <span className="text-sm text-gray-700">{option}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeBookmark(question._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookmarks;