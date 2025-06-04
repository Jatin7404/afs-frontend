import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function Quiz() {
  const [topics] = useState(["JavaScript", "React", "MongoDB"]);
  const [selectedTopic, setSelectedTopic] = useState("JavaScript");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (selectedTopic) {
      loadQuestions();
    }
  }, [selectedTopic]);

  const loadQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://afs-backend-x5k5.onrender.com/api/quiz/${selectedTopic}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuestions(response.data);
      setAnswers({});
      setSubmitted(false);
      setResult(null);
    } catch (err) {
      setError("Failed to load questions");
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://afs-backend-x5k5.onrender.com/api/quiz/submit",
        {
          topic: selectedTopic,
          answers,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResult(response.data);
      setSubmitted(true);
    } catch (err) {
      setError("Failed to submit quiz");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Technical Quiz</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Topic
        </label>
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-4"
        >
          <option value="">Choose a topic</option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      {questions.length > 0 && !submitted && (
        <div className="space-y-8">
          {questions.map((question, index) => (
            <div key={question._id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {index + 1}. {question.question}
              </h3>
              <div className="space-y-4">
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center">
                    <input
                      type="radio"
                      id={`${question._id}-${optIndex}`}
                      name={question._id}
                      value={option}
                      checked={answers[question._id] === option}
                      onChange={() => handleAnswerChange(question._id, option)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`${question._id}-${optIndex}`}
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Submit Quiz
          </button>
        </div>
      )}

      {submitted && result && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Quiz Results
          </h2>
          <div className="space-y-4">
            <p className="text-lg">Score: {result.score}%</p>
            <p className="text-lg">
              Correct Answers: {result.correct} out of {result.total}
            </p>
            <button
              onClick={() => setSelectedTopic("")}
              className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Take Another Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;
